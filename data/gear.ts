export interface Gear {
  category: string;
  model: string;
}

export const gears: Gear[] = [
  { category: "Keyboard", model: "Keychron Q1 HE" },
  { category: "Magnetic Switches", model: "Gateron Double-Rail Nebula" },
  { category: "Windows/Linux Machine", model: "ASUS ROG Zephyrus G14 (RTX 4070, 2024)" },
  { category: "macOS Machine", model: "MacBook Pro 14-inch (M2 Pro, 2023)" },
  { category: "Tablet", model: "iPad Pro 11-inch (M2, 2022)" },
  { category: "Phone", model: "iPhone 16 Pro" },
  { category: "Monitor", model: "Dell G3223Q (32-inch, 4K, 144Hz)" },
  { category: "Mouse", model: "Razer Basilisk V3" },
  { category: "Headset", model: "ASUS ROG Delta S" },
  { category: "Earbuds", model: "Apple AirPods Pro (2nd Generation)" },
  { category: "Portable SSD", model: "SanDisk Extreme Pro 1TB"},
  { category: "Drawing Tablet", model: "Wacom Intuos S" },
];