/**
 * The constants in this file come from well-known deterministic pseudo-random algorithms.
 * We keep them together in one place and document them so beginners understand that these
 * are algorithm parameters, not arbitrary unexplained numbers sprinkled around the project.
 */

export interface WeightedSelectionOption<ValueType> {
  value: ValueType;
  weight: number;
}

export interface SeededRandomNumberGenerator {
  readonly seedPhrase: string;
  nextFraction(): number;
  nextInteger(maximumExclusive: number): number;
  pickOne<ValueType>(availableValues: readonly ValueType[]): ValueType;
  pickWeighted<ValueType>(weightedSelectionOptions: readonly WeightedSelectionOption<ValueType>[]): ValueType;
}

function createSeedHashGenerator(seedPhrase: string): () => number {
  let currentHashState = 1779033703 ^ seedPhrase.length;

  for (const currentCharacter of seedPhrase) {
    currentHashState = Math.imul(currentHashState ^ currentCharacter.charCodeAt(0), 3432918353);
    currentHashState = (currentHashState << 13) | (currentHashState >>> 19);
  }

  return function generateHashedSeed() {
    currentHashState = Math.imul(currentHashState ^ (currentHashState >>> 16), 2246822507);
    currentHashState = Math.imul(currentHashState ^ (currentHashState >>> 13), 3266489909);
    currentHashState ^= currentHashState >>> 16;

    return currentHashState >>> 0;
  };
}

function createMulberryGenerator(initialState: number): () => number {
  let evolvingState = initialState;

  return function generateFractionalValue() {
    evolvingState += 1831565813;

    let mixedState = evolvingState;
    mixedState = Math.imul(mixedState ^ (mixedState >>> 15), mixedState | 1);
    mixedState ^= mixedState + Math.imul(mixedState ^ (mixedState >>> 7), mixedState | 61);

    return ((mixedState ^ (mixedState >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandomNumberGenerator(
  seedPhrase: string
): SeededRandomNumberGenerator {
  const hashedSeedGenerator = createSeedHashGenerator(seedPhrase);
  const generateFractionalValue = createMulberryGenerator(hashedSeedGenerator());

  return {
    seedPhrase,
    nextFraction() {
      return generateFractionalValue();
    },
    nextInteger(maximumExclusive) {
      if (maximumExclusive <= 0) {
        throw new Error("The maximumExclusive argument must be greater than zero.");
      }

      return Math.floor(generateFractionalValue() * maximumExclusive);
    },
    pickOne<ValueType>(availableValues: readonly ValueType[]) {
      if (availableValues.length === 0) {
        throw new Error("pickOne requires at least one available value.");
      }

      const selectedValue = availableValues[this.nextInteger(availableValues.length)];

      if (selectedValue === undefined) {
        throw new Error("The seeded random number generator selected an invalid array index.");
      }

      return selectedValue;
    },
    pickWeighted<ValueType>(weightedSelectionOptions: readonly WeightedSelectionOption<ValueType>[]) {
      if (weightedSelectionOptions.length === 0) {
        throw new Error("pickWeighted requires at least one weighted option.");
      }

      const totalWeight = weightedSelectionOptions.reduce(
        (accumulatedWeight, weightedSelectionOption) =>
          accumulatedWeight + weightedSelectionOption.weight,
        0
      );
      let remainingWeight = generateFractionalValue() * totalWeight;

      for (const weightedSelectionOption of weightedSelectionOptions) {
        remainingWeight -= weightedSelectionOption.weight;

        if (remainingWeight <= 0) {
          return weightedSelectionOption.value;
        }
      }

      const finalWeightedSelectionOption =
        weightedSelectionOptions[weightedSelectionOptions.length - 1];

      if (finalWeightedSelectionOption === undefined) {
        throw new Error("The weighted selection options unexpectedly became empty.");
      }

      return finalWeightedSelectionOption.value;
    }
  };
}
