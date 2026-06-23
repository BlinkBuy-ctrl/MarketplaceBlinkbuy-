# 🔘 Premium Button System - Black & Pink Marketplace

All premium buttons ready to use in your marketplace!

---

## 🎯 **PRIMARY BUTTONS** (Main Actions)

### Button 1: Solid Pink (Hero CTA)
```jsx
<Link href="/marketplace" 
  className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-pink-500/50 border border-pink-400/30"
>
  <ShoppingBag size={16} />
  Explore Marketplace
</Link>
```

### Button 2: Sell Item (Header Button)
```jsx
<Link href="/post-item"
  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-pink-500/50 border border-pink-400/20"
>
  <Plus size={14} /> Sell Item
</Link>
```

### Button 3: Checkout Button (Teal Pricing)
```jsx
<button
  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-pink-500/50 border border-pink-400/30"
>
  <Zap size={16} className="inline mr-2" />
  Buy Now - MK 120,000
</button>
```

---

## 📋 **SECONDARY BUTTONS** (Alternative Actions)

### Button 1: Pink Outline
```jsx
<button
  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 border border-white/20 hover:border-pink-500/40 backdrop-blur-sm"
>
  <Plus size={16} />
  Start Selling
</button>
```

### Button 2: Filter Chip (Active)
```jsx
<button
  className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 px-3 py-1.5 rounded-full text-xs px-3 py-1.5 rounded-full text-xs font-bold border border-pink-500/30 hover:border-pink-500"
>
  Electronics
  <X size={12} />
</button>
```

### Button 3: Wishlist / Like Button
```jsx
<button
  className="p-3 rounded-lg border border-pink-500/20 text-pink-500 hover:bg-pink-500/10 hover:border-pink-500 transition-all duration-200"
>
  <Heart size={18} />
</button>
```

---

## 🎪 **SPECIAL BUTTONS** (Specific Functions)

### Button 1: Theme Toggle
```jsx
<button
  onClick={toggleTheme}
  className="p-2.5 text-white/60 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all duration-200 border border-white/10 hover:border-pink-500/30"
>
  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
</button>
```

### Button 2: Pagination Button
```jsx
<button
  onClick={() => setPage(pageNum)}
  className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${
    isActive
      ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white border border-pink-500"
      : "border border-border text-foreground hover:border-pink-500 hover:text-pink-500"
  }`}
>
  {pageNum}
</button>
```

### Button 3: Delete / Remove Button
```jsx
<button
  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all duration-200 border border-red-500/30"
>
  <Trash2 size={16} />
</button>
```

### Button 4: Loading Button (Submitting)
```jsx
<button
  type="submit"
  disabled={loading}
  className="w-full bg-gradient-to-r from-pink-500 to-pink-600 disabled:from-pink-400 disabled:to-pink-500 text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Publishing...
    </>
  ) : (
    <>
      <Upload size={18} /> List for Sale
    </>
  )}
</button>
```

---

## 🎨 **BUTTON VARIATIONS**

### Size Variations

**Large Button** (Full-width)
```jsx
<button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-base">
  Large Button
</button>
```

**Medium Button** (Standard)
```jsx
<button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-xl font-bold text-sm">
  Medium Button
</button>
```

**Small Button** (Compact)
```jsx
<button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 px-4 rounded-lg font-bold text-xs">
  Small Button
</button>
```

### With Icons

**Left Icon**
```jsx
<button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
  <Plus size={16} /> Add Item
</button>
```

**Right Icon**
```jsx
<button className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold text-sm">
  Continue <ArrowRight size={16} />
</button>
```

**Icon Only**
```jsx
<button className="p-3 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-all">
  <Heart size={18} />
</button>
```

---

## 🌈 **COLOR VARIANTS**

### Pink Primary
```jsx
className="bg-gradient-to-r from-pink-500 to-pink-600 text-white"
```

### Pink Outline
```jsx
className="border-2 border-pink-500 text-pink-500 hover:bg-pink-500/10"
```

### Pink Ghost (Minimal)
```jsx
className="text-pink-500 hover:bg-pink-500/10"
```

### Disabled State
```jsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Dark Background (Text only)
```jsx
className="text-foreground hover:text-pink-500"
```

---

## 🎪 **INTERACTIVE BUTTON COMPONENT**

Ready-to-use React component:

```jsx
// ButtonComponent.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  loading,
  disabled,
  onClick,
  className = '',
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-lg transition-all duration-200 flex items-center gap-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg hover:shadow-pink-500/50 border border-pink-400/30',
    secondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-pink-500/40',
    outline: 'border-2 border-pink-500 text-pink-500 hover:bg-pink-500/10',
    ghost: 'text-pink-500 hover:bg-pink-500/10',
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? <Spinner size={size} /> : icon}
      {children}
    </button>
  );
}

// Usage:
<Button variant="primary" size="lg">
  <Plus size={16} /> Start Selling
</Button>
```

---

## 🎯 **BEST PRACTICES**

✅ **Do:**
- Use pink for primary actions
- Add icons for clarity
- Include hover effects
- Use shadows for depth
- Keep text short and punchy
- Add loading states

❌ **Don't:**
- Use too many button styles
- Make buttons too small
- Ignore mobile touch targets
- Skip hover states
- Use light pink on light backgrounds
- Animate button scale more than 5%

---

## 🚀 **COMMON USE CASES**

### Hero CTA
```jsx
<button className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-xl font-bold text-lg">
  Explore Now
</button>
```

### Card Action
```jsx
<button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2.5 rounded-lg font-bold text-xs">
  View Details
</button>
```

### Form Submit
```jsx
<button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-xl font-bold">
  Submit
</button>
```

### Navigation Link
```jsx
<Link href="/marketplace" className="text-pink-500 hover:text-pink-600 font-bold">
  View All →
</Link>
```

### Quick Action
```jsx
<button className="p-2 rounded-lg bg-pink-500/10 text-pink-500 hover:bg-pink-500/20">
  <Heart size={18} />
</button>
```

---

## 📱 **MOBILE RESPONSIVE**

Make buttons touch-friendly on mobile:

```jsx
// Good for mobile
<button className="px-6 py-3.5 rounded-xl"> // ~44-48px height
  
// Bad for mobile  
<button className="px-2 py-1 rounded-md"> // Too small!
```

---

## 🎨 **ACCESSIBILITY**

Always include:
- Proper contrast (WCAG AA)
- Focus states
- Disabled states
- Screen reader labels
- Keyboard navigation

```jsx
<button
  className="focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
  aria-label="Add item to cart"
>
  Add to Cart
</button>
```

---

## 🔗 **ICON LIBRARY**

All icons from Lucide React:
- Plus, Minus, X
- Heart, Star, Share2
- ShoppingBag, ShoppingCart
- Upload, Download
- Filter, Search
- ArrowRight, ArrowLeft
- Zap, Flame
- CheckCircle, AlertCircle

Import as needed:
```jsx
import { Plus, Heart, ShoppingBag } from 'lucide-react';
```

---

**All buttons ready to use! 🚀 Pick your favorite and customize!**
