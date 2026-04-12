# Animation Polish Spec

## Goal
Wire up the motion token system (`motion-tokens.js`) across all screens. The app should feel alive — springs on interactive elements, staggered reveals, value transitions. Use the existing tokens, don't create new ones.

Read `src/motion-tokens.js` first — it defines all available tokens and their intended usage.

## Changes by Screen

### HomeScreen
- **Portfolio value**: Animate the `$23,000` number on mount with a count-up effect (animate from 0 to final value over ~600ms using `m.valueUpdate`)
- **Action buttons row** (Swap, Buy, Send, Receive): Stagger entrance with spring — each button scales from 0.8 to 1 with `m.springTight`, delayed by index
- **"Put it all to work" card**: Slide up with `m.spring` on mount, slight scale from 0.95
- **Smart nudges**: Already has springTight — good
- **Token rows**: Already staggered — good. Add a subtle scale on the swipe reveal (actions panel scales from 0.95 to 1 when swiped open)

### SwapScreen
- **Swap arrow rotation**: Use `m.spring` for the 180° rotation when toggling pay/receive direction. Currently it likely just snaps.
- **Token pill appear**: When a token is selected from SwapSelectScreen, the pill should pop in with `m.tokenAppear`
- **Amount input**: When typing, the number should have a subtle scale pulse (1 → 1.02 → 1) on each keypress using `m.valueUpdate`
- **CTA button**: Already uses `m.cta` crossfade — good

### ExploreScreen
- **Category tabs**: Active tab indicator should animate position with `m.spring` (sliding underline)
- **Token cards**: Stagger entrance with fade + y offset (should already be there, verify)
- **Search input focus**: Expand with spring when focused

### ActivityScreen
- **Transaction rows**: Stagger entrance like HomeScreen token rows
- **Detail sheet**: Should use `m.sheet` spring when opening (verify)

### OptimiseScreen
- **Row toggle**: When deselecting/selecting a row, animate opacity with `m.valueUpdate` instead of instant CSS transition
- **Total value**: Animate the number change when toggling rows (count up/down)
- **Hero yield amount**: Count-up on mount from 0 to $969

### SettingsScreen
- **Panel transitions**: Already slides — verify using spring physics from `m.modal`
- **Toggle switches**: Use `m.spring` for the thumb movement

### SendScreen / SendAmountScreen
- **Contact row stagger**: Stagger entrance
- **Amount display**: Scale pulse on keypress like SwapScreen

### ReceiveScreen
- **QR code**: Already pops in with `m.springTight` — good
- **Address copy**: Flash feedback with `m.valueUpdate`

### SuccessScreen
- **Checkmark**: Scale from 0 to 1 with `m.spring` (celebratory entrance)
- **Summary text**: Fade in with delay after checkmark lands
- **Action buttons**: Stagger with `m.springTight`

### AssetScreen
- **Chart**: Fade in with delay
- **Price display**: Count-up animation
- **Earn section**: Stagger entrance
- **Action buttons**: Spring entrance

## Global Patterns
- **Every list**: Stagger children with `delay: 0.04 + index * 0.05`
- **Every pressable element**: Add `whileTap={{ scale: 0.97 }}` for tactile feedback on press
- **Every toggle/switch**: Spring physics on state change
- **Every number that changes**: Use `m.valueUpdate` transition

## Rules
- Import motion tokens: `import { motion as m } from './motion-tokens'`
- Never use raw duration values — always reference `m.*` tokens
- `whileTap` for press feedback, `whileHover` for desktop hover (if appropriate)
- Don't over-animate — if removing an animation makes the interaction clearer, don't add it
- Run `cd React && npm run build` when done, verify 0 errors
