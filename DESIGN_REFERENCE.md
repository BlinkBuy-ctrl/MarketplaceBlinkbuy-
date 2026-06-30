# 🎨 Market Hub Malawi - Design Quick Reference

## Color Palette

### Primary Brand Colors
```
🔴 Hot Pink       #FF2D8D    ← Main CTA buttons, highlights
🩷 Light Pink     #FF6FAE    ← Gradients, secondary actions
💗 Dark Pink      #E0256F    ← Hover states, active states
```

### Background Colors
```
⬛ Dark Black      #0F0F0F    ← Page background
🔘 Dark Gray      #1C1C1C    ← Card backgrounds
⚫ Light Gray      #2C2C2C    ← Hover states, borders
```

### Text Colors
```
⚪ White          #FFFFFF    ← Primary text
🩶 Light Gray     #B5B5B5    ← Secondary text
🔲 Dark Gray      #888888    ← Tertiary text
```

### Status & Utility Colors
```
✅ Success        #10B981    ← Green checkmarks
⚠️ Warning        #F59E0B    ← Yellow alerts
❌ Error          #EF4444    ← Red errors
ℹ️ Info           #3B82F6    ← Blue information
```

---

## Quick Copy-Paste Color Codes

### Tailwind Classes (No Setup Needed)
```
bg-[#FF2D8D]      ← Hot Pink background
bg-[#0F0F0F]      ← Dark Black background
bg-[#1C1C1C]      ← Dark Gray background
text-[#FF2D8D]    ← Hot Pink text
text-[#FFFFFF]    ← White text
text-[#B5B5B5]    ← Gray text
border-[#FF2D8D]  ← Pink border
```

### CSS Variables (Add to :root)
```css
--primary: #FF2D8D;
--primary-light: #FF6FAE;
--primary-dark: #E0256F;
--background: #0F0F0F;
--surface: #1C1C1C;
--surface-light: #2C2C2C;
--text: #FFFFFF;
--text-secondary: #B5B5B5;
--text-tertiary: #888888;
```

---

## Component Snippets

### Primary Button
```jsx
<button className="bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-bold px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-[#FF2D8D]/50 transition-all">
  Click Me
</button>
```

### Card Component
```jsx
<div className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20 hover:border-[#FF2D8D] transition-all">
  Content here
</div>
```

### Search Input
```jsx
<input
  type="text"
  className="bg-[#1C1C1C] border-2 border-[#FF2D8D]/30 rounded-lg px-4 py-3 text-white placeholder-[#B5B5B5] focus:border-[#FF2D8D]"
  placeholder="Search..."
/>
```

### Badge/Tag
```jsx
<span className="bg-[#FF2D8D]/20 text-[#FF2D8D] px-3 py-1 rounded-full text-xs font-semibold">
  Verified
</span>
```

### Navigation Item
```jsx
<button className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#B5B5B5] hover:bg-[#2C2C2C] hover:text-white transition-colors">
  <Icon size={20} />
  Label
</button>
```

---

## Typography Scale

```
Heading 1: text-4xl md:text-5xl font-black
Heading 2: text-3xl font-black
Heading 3: text-2xl font-bold
Heading 4: text-xl font-bold
Body:      text-base font-normal
Small:     text-sm font-normal
Tiny:      text-xs font-normal
```

---

## Spacing Scale

```
xs:   0.25rem (4px)
sm:   0.5rem  (8px)
md:   1rem    (16px)
lg:   1.5rem  (24px)
xl:   2rem    (32px)
2xl:  2.5rem  (40px)
```

---

## Border Radius Scale

```
sm:   0.375rem (6px)
md:   0.5rem   (8px)
lg:   0.75rem  (12px)
xl:   1rem     (16px)
full: 9999px   (fully rounded)
```

---

## Shadow System

```
sm:  0 1px 2px rgba(0, 0, 0, 0.05)
md:  0 4px 6px -1px rgba(255, 45, 141, 0.1)
lg:  0 10px 15px -3px rgba(255, 45, 141, 0.2)
xl:  0 20px 25px -5px rgba(255, 45, 141, 0.3)
```

### Pink Glow Shadow
```jsx
className="hover:shadow-lg hover:shadow-[#FF2D8D]/50"
```

---

## Transitions & Animations

### Duration
```
fast: 150ms
base: 300ms
slow: 500ms
```

### Easing Function
```
ease-in-out (recommended for all transitions)
```

### Common Transitions
```jsx
transition-all duration-300         // All properties
transition-colors duration-300      // Color only
transition-transform duration-300   // Transform only
transition-opacity duration-300     // Opacity only
```

---

## Malawi Districts Reference

```
🏛️  Lilongwe (Capital)
🏢 Blantyre (Commercial Hub)
🏘️  Mzuzu (Northern Region)
📍 Zomba (Eastern Region)
🗺️  Kasungu
🌊 Nkhata Bay
⛰️  Dedza
🏖️  Mangochi
```

---

## Currency Format

**MWK - Malawi Kwacha**
```
K 45,000
K 125,500
K 1,000,000

Format: "K " + number (with comma separator for thousands)
```

---

## Icon Library

Using **lucide-react** icons throughout:
```jsx
import { 
  Heart, Share2, MessageCircle, MapPin, Star,
  TrendingUp, Zap, Fire, Clock, Search, Menu, X,
  BarChart3, Box, Users, ShoppingCart, Home,
  Settings, Eye, AlertCircle, CheckCircle, LogOut
} from 'lucide-react';
```

---

## Responsive Breakpoints

```
Mobile:   < 768px   (md)
Tablet:   768px     (md to lg)
Desktop:  1024px+   (lg)
```

### Responsive Grid Examples
```jsx
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
p-4 md:p-6 lg:p-8
text-2xl md:text-3xl lg:text-4xl
```

---

## Hover & Active States

### Button Hover
```jsx
hover:shadow-lg hover:shadow-[#FF2D8D]/50 hover:scale-105
```

### Card Hover
```jsx
hover:border-[#FF2D8D] hover:scale-105 transition-all
```

### Link Hover
```jsx
hover:text-[#FF2D8D] hover:underline transition-colors
```

---

## Dark Mode Considerations

**Always consider:**
- ✅ High contrast text on dark backgrounds
- ✅ Use of opacity for subtle backgrounds (e.g., `bg-[#FF2D8D]/20`)
- ✅ Pink glow effects for emphasis
- ✅ Sufficient border colors for card separation
- ✅ Focus states for accessibility

---

## Brand Guidelines Summary

### Do ✅
- Use pink for interactive elements (buttons, links)
- Use dark backgrounds for maximum contrast
- Add shadows/glows with pink tint for depth
- Make CTAs prominent with hot pink
- Use gradients sparingly (pink gradients only)

### Don't ❌
- Overuse pink (only highlights, max 30%)
- Use light backgrounds (dark is the standard)
- Apply gradients outside pink spectrum
- Reduce contrast for "aesthetic" reasons
- Use multiple pink shades on same element

---

## Quick Implementation Checklist

- [ ] Update color variables in CSS
- [ ] Apply theme.ts to all components
- [ ] Replace old button styles
- [ ] Update card components
- [ ] Refresh navigation styling
- [ ] Test contrast & accessibility
- [ ] Check responsive designs
- [ ] Verify hover states work
- [ ] Test on mobile devices
- [ ] Update splash screen branding

---

## Example Component Palette

### Button Variations
```
Primary:   bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE]
Secondary: bg-[#1C1C1C] border border-[#FF2D8D]/30
Ghost:     text-[#FF2D8D] bg-transparent
Danger:    bg-red-500 text-white
Success:   bg-green-500 text-white
```

### Status Badges
```
Verified:     bg-[#FF2D8D]/20 text-[#FF2D8D]
Completed:    bg-green-500/20 text-green-400
Pending:      bg-yellow-500/20 text-yellow-400
Processing:   bg-blue-500/20 text-blue-400
Error:        bg-red-500/20 text-red-400
```

---

## Design Tools Color Export

### Figma
```
Fill: #FF2D8D
Fill: #FF6FAE
Fill: #0F0F0F
Fill: #1C1C1C
Fill: #B5B5B5
Fill: #FFFFFF
```

### Adobe XD
Same hex values as above

### Sketch
Same hex values as above

---

## Need to Adjust?

**Palette Generator:** https://coolors.co
- Use #FF2D8D as base
- Adjust saturation for variations
- Keep dark backgrounds consistent

---

## Final Notes

This design system is:
✅ **Mobile-first** - Works on all devices
✅ **Accessible** - High contrast ratios
✅ **Modern** - Smooth animations & transitions
✅ **Scalable** - Easy to extend
✅ **Malawi-focused** - Local language ready

Happy designing! 🎨
