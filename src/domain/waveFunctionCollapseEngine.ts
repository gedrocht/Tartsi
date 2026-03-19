import {
  areLanguageSymbolsCompatible,
  filterLanguageSymbolsForRingRole,
  getRingRoleIdentifier,
  languageSymbolDefinitionMap,
  type DirectionalRelationshipIdentifier,
  type RingRoleIdentifier
} from "./magicCircleLanguage";
import type { SeededRandomNumberGenerator } from "../utilities/seededRandomNumberGenerator";

/**
 * A ring blueprint is the minimal structural information required before we assign symbols.
 * The generator decides how many segments each ring should contain, and the solver fills
 * those segments with compatible symbols.
 */
export interface MagicCircleRingBlueprint {
  ringIndex: number;
  segmentCount: number;
  ringRoleIdentifier: RingRoleIdentifier;
}

export interface MagicCircleCellAddress {
  ringIndex: number;
  segmentIndex: number;
}

export interface CollapsedMagicCircleCell {
  ringIndex: number;
  segmentIndex: number;
  languageSymbolIdentifier: string;
}

export interface CollapsedMagicCircleRing {
  ringIndex: number;
  segmentCount: number;
  ringRoleIdentifier: RingRoleIdentifier;
  collapsedCells: CollapsedMagicCircleCell[];
}

export interface WaveFunctionCollapseResult {
  collapsedRings: CollapsedMagicCircleRing[];
  restartCount: number;
}

interface MutableCellPossibilityState {
  ringIndex: number;
  segmentIndex: number;
  remainingLanguageSymbolIdentifiers: string[];
}

const minimumCompatibilityThreshold = 1;
const maximumRestartCount = 48;

function createCellStateKey(magicCircleCellAddress: MagicCircleCellAddress): string {
  return `${magicCircleCellAddress.ringIndex}:${magicCircleCellAddress.segmentIndex}`;
}

function normalizeSegmentIndex(segmentIndex: number, segmentCount: number): number {
  return ((segmentIndex % segmentCount) + segmentCount) % segmentCount;
}

function getCellStateOrThrow(
  mutableCellPossibilityStateMap: Map<string, MutableCellPossibilityState>,
  magicCircleCellAddress: MagicCircleCellAddress
): MutableCellPossibilityState {
  const mutableCellPossibilityState = mutableCellPossibilityStateMap.get(
    createCellStateKey(magicCircleCellAddress)
  );

  if (mutableCellPossibilityState === undefined) {
    throw new Error("A cell state was requested before it had been created.");
  }

  return mutableCellPossibilityState;
}

function getRadialNeighborAddresses(
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  magicCircleCellAddress: MagicCircleCellAddress,
  neighboringRingIndex: number
): MagicCircleCellAddress[] {
  const currentRingBlueprint = ringBlueprints[magicCircleCellAddress.ringIndex];
  const neighboringRingBlueprint = ringBlueprints[neighboringRingIndex];

  if (currentRingBlueprint === undefined || neighboringRingBlueprint === undefined) {
    return [];
  }

  const currentSegmentStartRatio =
    magicCircleCellAddress.segmentIndex / currentRingBlueprint.segmentCount;
  const currentSegmentEndRatio =
    (magicCircleCellAddress.segmentIndex + 1) / currentRingBlueprint.segmentCount;

  return Array.from({ length: neighboringRingBlueprint.segmentCount }, (_, neighboringSegmentIndex) => {
    const neighboringSegmentStartRatio =
      neighboringSegmentIndex / neighboringRingBlueprint.segmentCount;
    const neighboringSegmentEndRatio =
      (neighboringSegmentIndex + 1) / neighboringRingBlueprint.segmentCount;
    const overlappingStartRatio = Math.max(currentSegmentStartRatio, neighboringSegmentStartRatio);
    const overlappingEndRatio = Math.min(currentSegmentEndRatio, neighboringSegmentEndRatio);

    return {
      neighboringSegmentIndex,
      overlapAmount: overlappingEndRatio - overlappingStartRatio
    };
  })
    .filter((overlapResult) => overlapResult.overlapAmount > 0)
    .sort(
      (firstOverlapResult, secondOverlapResult) =>
        secondOverlapResult.overlapAmount - firstOverlapResult.overlapAmount
    )
    .map((overlapResult) => ({
      ringIndex: neighboringRingIndex,
      segmentIndex: overlapResult.neighboringSegmentIndex
    }));
}

function getNeighborReferences(
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  magicCircleCellAddress: MagicCircleCellAddress
): Array<{
  directionalRelationshipIdentifier: DirectionalRelationshipIdentifier;
  neighboringMagicCircleCellAddress: MagicCircleCellAddress;
}> {
  const currentRingBlueprint = ringBlueprints[magicCircleCellAddress.ringIndex];

  if (currentRingBlueprint === undefined) {
    return [];
  }

  const tangentialNeighbors = [
    {
      directionalRelationshipIdentifier: "tangential" as const,
      neighboringMagicCircleCellAddress: {
        ringIndex: magicCircleCellAddress.ringIndex,
        segmentIndex: normalizeSegmentIndex(
          magicCircleCellAddress.segmentIndex - 1,
          currentRingBlueprint.segmentCount
        )
      }
    },
    {
      directionalRelationshipIdentifier: "tangential" as const,
      neighboringMagicCircleCellAddress: {
        ringIndex: magicCircleCellAddress.ringIndex,
        segmentIndex: normalizeSegmentIndex(
          magicCircleCellAddress.segmentIndex + 1,
          currentRingBlueprint.segmentCount
        )
      }
    }
  ];

  const radialNeighbors = [
    ...getRadialNeighborAddresses(
      ringBlueprints,
      magicCircleCellAddress,
      magicCircleCellAddress.ringIndex - 1
    ),
    ...getRadialNeighborAddresses(
      ringBlueprints,
      magicCircleCellAddress,
      magicCircleCellAddress.ringIndex + 1
    )
  ].map((neighboringMagicCircleCellAddress) => ({
    directionalRelationshipIdentifier: "radial" as const,
    neighboringMagicCircleCellAddress
  }));

  return [...tangentialNeighbors, ...radialNeighbors];
}

function buildInitialCellPossibilityStateMap(
  ringBlueprints: readonly MagicCircleRingBlueprint[]
): Map<string, MutableCellPossibilityState> {
  const mutableCellPossibilityStateMap = new Map<string, MutableCellPossibilityState>();

  for (const ringBlueprint of ringBlueprints) {
    const allowedLanguageSymbolDefinitions = filterLanguageSymbolsForRingRole(
      ringBlueprint.ringRoleIdentifier
    );
    const allowedLanguageSymbolIdentifiers = allowedLanguageSymbolDefinitions.map(
      (languageSymbolDefinition) => languageSymbolDefinition.identifier
    );

    for (
      let currentSegmentIndex = 0;
      currentSegmentIndex < ringBlueprint.segmentCount;
      currentSegmentIndex += 1
    ) {
      const magicCircleCellAddress = {
        ringIndex: ringBlueprint.ringIndex,
        segmentIndex: currentSegmentIndex
      };

      mutableCellPossibilityStateMap.set(createCellStateKey(magicCircleCellAddress), {
        ringIndex: ringBlueprint.ringIndex,
        segmentIndex: currentSegmentIndex,
        remainingLanguageSymbolIdentifiers: [...allowedLanguageSymbolIdentifiers]
      });
    }
  }

  return mutableCellPossibilityStateMap;
}

function getSymmetryPartnerAddresses(
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  magicCircleCellAddress: MagicCircleCellAddress,
  symmetrySectorCount: number
): MagicCircleCellAddress[] {
  const currentRingBlueprint = ringBlueprints[magicCircleCellAddress.ringIndex];

  if (currentRingBlueprint === undefined || symmetrySectorCount <= minimumCompatibilityThreshold) {
    return [magicCircleCellAddress];
  }

  const symmetryPartnerAddresses = new Map<string, MagicCircleCellAddress>();

  for (
    let symmetrySectorIndex = 0;
    symmetrySectorIndex < symmetrySectorCount;
    symmetrySectorIndex += 1
  ) {
    const normalizedSegmentIndex = Math.round(
      (magicCircleCellAddress.segmentIndex +
        (symmetrySectorIndex * currentRingBlueprint.segmentCount) / symmetrySectorCount) %
        currentRingBlueprint.segmentCount
    );
    const symmetryPartnerAddress = {
      ringIndex: magicCircleCellAddress.ringIndex,
      segmentIndex: normalizeSegmentIndex(normalizedSegmentIndex, currentRingBlueprint.segmentCount)
    };

    symmetryPartnerAddresses.set(createCellStateKey(symmetryPartnerAddress), symmetryPartnerAddress);
  }

  return [...symmetryPartnerAddresses.values()];
}

function chooseNextCellAddressWithLowestEntropy(
  mutableCellPossibilityStateMap: Map<string, MutableCellPossibilityState>,
  seededRandomNumberGenerator: SeededRandomNumberGenerator
): MagicCircleCellAddress | undefined {
  const uncollapsedCellPossibilityStates = [...mutableCellPossibilityStateMap.values()].filter(
    (mutableCellPossibilityState) =>
      mutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length > minimumCompatibilityThreshold
  );

  if (uncollapsedCellPossibilityStates.length === 0) {
    return undefined;
  }

  const lowestEntropyValue = Math.min(
    ...uncollapsedCellPossibilityStates.map(
      (mutableCellPossibilityState) => mutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length
    )
  );

  const lowestEntropyCellPossibilityStates = uncollapsedCellPossibilityStates.filter(
    (mutableCellPossibilityState) =>
      mutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length === lowestEntropyValue
  );
  const selectedCellPossibilityState = seededRandomNumberGenerator.pickOne(
    lowestEntropyCellPossibilityStates
  );

  return {
    ringIndex: selectedCellPossibilityState.ringIndex,
    segmentIndex: selectedCellPossibilityState.segmentIndex
  };
}

function chooseCollapsedLanguageSymbolIdentifier(
  mutableCellPossibilityState: MutableCellPossibilityState,
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  seededRandomNumberGenerator: SeededRandomNumberGenerator
): string {
  const currentRingBlueprint = ringBlueprints[mutableCellPossibilityState.ringIndex];

  if (currentRingBlueprint === undefined) {
    throw new Error("A ring blueprint was requested before it existed.");
  }

  const weightedSelectionOptions = mutableCellPossibilityState.remainingLanguageSymbolIdentifiers.map(
    (languageSymbolIdentifier) => {
      const languageSymbolDefinition = languageSymbolDefinitionMap.get(languageSymbolIdentifier);

      if (languageSymbolDefinition === undefined) {
        throw new Error("A language symbol identifier was missing from the definition map.");
      }

      const preferredRoleBonus = languageSymbolDefinition.preferredRingRoleIdentifiers.includes(
        currentRingBlueprint.ringRoleIdentifier
      )
        ? 3
        : 1;

      return {
        value: languageSymbolIdentifier,
        weight: preferredRoleBonus + languageSymbolDefinition.strokeWeightMultiplier
      };
    }
  );

  return seededRandomNumberGenerator.pickWeighted(weightedSelectionOptions);
}

function collapseCellAndSymmetryPartners(
  mutableCellPossibilityStateMap: Map<string, MutableCellPossibilityState>,
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  magicCircleCellAddress: MagicCircleCellAddress,
  symmetrySectorCount: number,
  seededRandomNumberGenerator: SeededRandomNumberGenerator
): MagicCircleCellAddress[] {
  const primaryMutableCellPossibilityState = getCellStateOrThrow(
    mutableCellPossibilityStateMap,
    magicCircleCellAddress
  );
  const selectedLanguageSymbolIdentifier = chooseCollapsedLanguageSymbolIdentifier(
    primaryMutableCellPossibilityState,
    ringBlueprints,
    seededRandomNumberGenerator
  );
  const affectedCellAddresses = getSymmetryPartnerAddresses(
    ringBlueprints,
    magicCircleCellAddress,
    symmetrySectorCount
  );

  for (const affectedCellAddress of affectedCellAddresses) {
    const mutableCellPossibilityState = getCellStateOrThrow(
      mutableCellPossibilityStateMap,
      affectedCellAddress
    );
    mutableCellPossibilityState.remainingLanguageSymbolIdentifiers = [selectedLanguageSymbolIdentifier];
  }

  return affectedCellAddresses;
}

function reduceNeighborPossibilities(
  mutableCellPossibilityStateMap: Map<string, MutableCellPossibilityState>,
  sourceMagicCircleCellAddress: MagicCircleCellAddress,
  directionalRelationshipIdentifier: DirectionalRelationshipIdentifier,
  neighboringMagicCircleCellAddress: MagicCircleCellAddress
): boolean {
  const sourceMutableCellPossibilityState = getCellStateOrThrow(
    mutableCellPossibilityStateMap,
    sourceMagicCircleCellAddress
  );
  const neighboringMutableCellPossibilityState = getCellStateOrThrow(
    mutableCellPossibilityStateMap,
    neighboringMagicCircleCellAddress
  );
  const previousNeighboringPossibilityCount =
    neighboringMutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length;

  neighboringMutableCellPossibilityState.remainingLanguageSymbolIdentifiers =
    neighboringMutableCellPossibilityState.remainingLanguageSymbolIdentifiers.filter(
      (neighboringLanguageSymbolIdentifier) =>
        sourceMutableCellPossibilityState.remainingLanguageSymbolIdentifiers.some(
          (sourceLanguageSymbolIdentifier) => {
            const sourceLanguageSymbolDefinition = languageSymbolDefinitionMap.get(
              sourceLanguageSymbolIdentifier
            );
            const neighboringLanguageSymbolDefinition = languageSymbolDefinitionMap.get(
              neighboringLanguageSymbolIdentifier
            );

            if (
              sourceLanguageSymbolDefinition === undefined ||
              neighboringLanguageSymbolDefinition === undefined
            ) {
              throw new Error("A required language symbol definition was missing.");
            }

            return areLanguageSymbolsCompatible(
              sourceLanguageSymbolDefinition,
              neighboringLanguageSymbolDefinition,
              directionalRelationshipIdentifier
            );
          }
        )
    );

  if (neighboringMutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length === 0) {
    return false;
  }

  return (
    neighboringMutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length !==
    previousNeighboringPossibilityCount
  );
}

function propagateConstraints(
  mutableCellPossibilityStateMap: Map<string, MutableCellPossibilityState>,
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  initiallyChangedCellAddresses: readonly MagicCircleCellAddress[]
): boolean {
  const pendingCellAddresses = [...initiallyChangedCellAddresses];

  while (pendingCellAddresses.length > 0) {
    const currentMagicCircleCellAddress = pendingCellAddresses.shift();

    if (currentMagicCircleCellAddress === undefined) {
      continue;
    }

    for (const neighborReference of getNeighborReferences(ringBlueprints, currentMagicCircleCellAddress)) {
      const neighborWasReduced = reduceNeighborPossibilities(
        mutableCellPossibilityStateMap,
        currentMagicCircleCellAddress,
        neighborReference.directionalRelationshipIdentifier,
        neighborReference.neighboringMagicCircleCellAddress
      );

      if (neighborWasReduced === false) {
        const neighboringMutableCellPossibilityState = getCellStateOrThrow(
          mutableCellPossibilityStateMap,
          neighborReference.neighboringMagicCircleCellAddress
        );

        if (neighboringMutableCellPossibilityState.remainingLanguageSymbolIdentifiers.length === 0) {
          return false;
        }

        continue;
      }

      pendingCellAddresses.push(neighborReference.neighboringMagicCircleCellAddress);
    }
  }

  return true;
}

function convertCollapsedStateMapToResult(
  mutableCellPossibilityStateMap: Map<string, MutableCellPossibilityState>,
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  restartCount: number
): WaveFunctionCollapseResult {
  const collapsedRings = ringBlueprints.map((ringBlueprint) => ({
    ringIndex: ringBlueprint.ringIndex,
    segmentCount: ringBlueprint.segmentCount,
    ringRoleIdentifier: ringBlueprint.ringRoleIdentifier,
    collapsedCells: Array.from({ length: ringBlueprint.segmentCount }, (_, currentSegmentIndex) => {
      const mutableCellPossibilityState = getCellStateOrThrow(mutableCellPossibilityStateMap, {
        ringIndex: ringBlueprint.ringIndex,
        segmentIndex: currentSegmentIndex
      });

      return {
        ringIndex: ringBlueprint.ringIndex,
        segmentIndex: currentSegmentIndex,
        languageSymbolIdentifier:
          mutableCellPossibilityState.remainingLanguageSymbolIdentifiers[0] ??
          "equilateral-triangle"
      };
    })
  }));

  return {
    collapsedRings,
    restartCount
  };
}

export function collapseMagicCircleLanguageAcrossRings(
  ringBlueprints: readonly MagicCircleRingBlueprint[],
  symmetrySectorCount: number,
  seededRandomNumberGenerator: SeededRandomNumberGenerator
): WaveFunctionCollapseResult {
  for (
    let currentRestartCount = 0;
    currentRestartCount <= maximumRestartCount;
    currentRestartCount += 1
  ) {
    const mutableCellPossibilityStateMap = buildInitialCellPossibilityStateMap(ringBlueprints);
    let solvingSucceeded = true;

    while (true) {
      const nextMagicCircleCellAddress = chooseNextCellAddressWithLowestEntropy(
        mutableCellPossibilityStateMap,
        seededRandomNumberGenerator
      );

      if (nextMagicCircleCellAddress === undefined) {
        break;
      }

      const changedCellAddresses = collapseCellAndSymmetryPartners(
        mutableCellPossibilityStateMap,
        ringBlueprints,
        nextMagicCircleCellAddress,
        symmetrySectorCount,
        seededRandomNumberGenerator
      );
      const propagationSucceeded = propagateConstraints(
        mutableCellPossibilityStateMap,
        ringBlueprints,
        changedCellAddresses
      );

      if (!propagationSucceeded) {
        solvingSucceeded = false;
        break;
      }
    }

    if (solvingSucceeded) {
      return convertCollapsedStateMapToResult(
        mutableCellPossibilityStateMap,
        ringBlueprints,
        currentRestartCount
      );
    }
  }

  throw new Error(
    "The wave function collapse process could not find a valid configuration within the restart budget."
  );
}

export function createRingBlueprintsFromSegmentCounts(
  segmentCounts: readonly number[]
): MagicCircleRingBlueprint[] {
  return segmentCounts.map((segmentCount, ringIndex, allSegmentCounts) => ({
    ringIndex,
    segmentCount,
    ringRoleIdentifier: getRingRoleIdentifier(ringIndex, allSegmentCounts.length)
  }));
}
