# PARIKSHAK — Industrial Safety Research Data

## 📌 Domain Overview & Safety Thresholds

The simulations, curriculum questions, and assessment rubrics in PARIKSHAK are calibrated using formal empirical datasets from mining, steel production, and metallurgy operations.

---

## 1. Fire Safety & PASS Protocol Standards

### Fire Classifications (IS 2190 / NFPA 10)
| Class | Fuel Type | Primary Industrial Hazard | Authorized Extinguishment Agent | Prohibited Agent |
|---|---|---|---|---|
| **Class A** | Ordinary Combustibles (Wood, Cloth, Coal, Rubber) | Coal conveyors, wooden props, paper waste | Pressurized Water, ABC Dry Chemical | Carbon Dioxide (ineffective on deep-seated fires) |
| **Class B** | Flammable Liquids & Gases (Diesel, Hydraulic Oil, Lubricants) | Diesel fuel tanks, lube oil rooms, hydraulic press lines | ABC Dry Chemical Powder, AFFF Mechanical Foam | **Water Jet** (causes violent steam explosion & spread) |
| **Class C** | Energized Electrical Equipment | 415V / 11kV Substation switchgears, transformer yards | Carbon Dioxide ($CO_2$), Clean Agent, ABC Dry Chemical | **Water / Conductive Foam** (fatal electrocution hazard) |
| **Class D** | Combustible Metals (Magnesium, Titanium, Aluminum powder) | Smelter potlines, metal grinding rooms | Special Dry Powder (TEC, Metal-X, Dry Sand) | **Water, $CO_2$, Foam** (releases explosive hydrogen gas) |

### PASS Extinguisher Operational Metrics
- **Pull (P)**: Break tamper seal and pull safety pin ($< 3.0$ seconds).
- **Aim (A)**: Direct nozzle at the base of the flame, not the smoke ($4.0 - 6.0$ feet safe standoff distance).
- **Squeeze (S)**: Fully depress lever to release discharge agent.
- **Sweep (S)**: Sweep side-to-side across the base until extinguished ($10 - 15$ seconds cylinder discharge time).

---

## 2. Hazardous Gas Exposure Thresholds (DGMS & OSHA Standards)

| Toxic Gas | Chemical Formula | Permissible Exposure Limit (TWA 8hr) | Short Term Limit (STEL 15min) | Immediately Dangerous to Life (IDLH) | Physiological Effect / Danger |
|---|---|---|---|---|---|
| **Methane** | $CH_4$ | N/A (Simple Asphyxiant) | Flammability range: **5.0% – 15.0%** in air | Explosion risk at $\ge 5\%$ | Underground explosion, ignition by electrical spark |
| **Carbon Monoxide** | $CO$ | 25 ppm | 100 ppm | 1,200 ppm | Binds hemoglobin to form carboxyhemoglobin, chemical asphyxiation |
| **Hydrogen Sulfide** | $H_2S$ | 10 ppm | 15 ppm | 100 ppm | Olfactory paralysis above 100 ppm; rapid respiratory arrest |
| **Oxygen Deficiency** | $O_2$ | **Minimum 19.5%** | N/A | $< 16.0\%$ | Impaired coordination ($<16\%$), loss of consciousness ($<10\%$) |

---

## 3. Digital Competency Rubrics

The PARIKSHAK server-side authoritative scoring engine evaluates worker performance across 5 fundamental dimensions:

1. **Hazard Recognition ($C_{HR}$)**: Ability to identify fuel type, electrical hazards, and confined space atmospheric threats.
2. **Procedural Execution ($C_{PE}$)**: Sequential correctness (e.g., LOTO steps, PASS protocol order).
3. **Safety Protocol Adherence ($C_{SA}$)**: Alarm activation, PPE compliance, safe standoff distance.
4. **Emergency Decision-Making ($C_{DM}$)**: Knowing when to fight vs. when to abort and evacuate.
5. **Speed & Reaction Latency ($C_{SL}$)**: Time elapsed from hazard ignition to initial corrective action.
