# How The Generator Works

The generator is not random chaos. It is constrained randomness.

## Step 1: Define the symbolic language

The file `src/domain/magicCircleLanguage.ts` describes the visual vocabulary. Each symbol has:

- A geometry family such as triangle, wave, or spiral
- A line character such as angular or curved
- A density level such as sparse or dense
- A motion family such as stable or orbital

These traits help the solver decide which symbols fit together.

## Step 2: Build ring blueprints

The generator calculates how many segments each ring should have based on:

- Ring count
- Base segment count
- Complexity level
- Symmetry sector count

The result is a list of ring blueprints that describe structure before symbols are assigned.

## Step 3: Run the wave-function-collapse-inspired solver

The solver begins with many possibilities in each cell. Then it:

1. Chooses the cell with the lowest remaining entropy.
2. Picks a symbol using deterministic seeded randomness.
3. Propagates compatibility constraints to neighboring cells.
4. Restarts if it paints itself into a contradiction.

This is what gives the circles a disciplined, language-like feel.

## Step 4: Render the final SVG

Once every cell has a symbol, the renderer places those symbols into concentric rings and adds:

- Ring guides
- Arcs
- A central core glyph
- A glowing outer starburst
