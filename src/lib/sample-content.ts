/** Seed content so a new user can run the full flow immediately. */

export interface SampleContent {
  id: string;
  label: string;
  hint: string;
  text: string;
}

export const SAMPLES: SampleContent[] = [
  {
    id: "lecture",
    label: "Lecture notes",
    hint: "Great for Prepare for Study",
    text: `CELL BIOLOGY - LECTURE 4: MEMBRANE TRANSPORT

Key idea: the plasma membrane is selectively permeable. It decides what enters and leaves the cell.

passive transport
- diffusion: molecules move from high to low concentration, no ATP needed
- osmosis: diffusion of water across a semi-permeable membrane
- facilitated diffusion: uses channel or carrier proteins, still no ATP

active transport
* requires ATP because it moves substances AGAINST the gradient
* sodium potassium pump: 3 Na+ out, 2 K+ in, per ATP
* endocytosis and exocytosis move bulk material in vesicles

tonicity   -   important for exam
hypotonic solution -> water enters cell -> cell swells, may lyse
hypertonic solution -> water leaves cell -> cell shrinks (crenation)
isotonic solution -> no net movement

Clinical note: IV fluids must usually be isotonic with blood plasma, otherwise red blood cells are damaged. Remember the pump is also the basis of the resting membrane potential in neurons.`,
  },
  {
    id: "product",
    label: "Product idea",
    hint: "Great for Build Website / App Spec",
    text: `Idea: a booking tool for small physiotherapy clinics.

Right now receptionists juggle a paper diary and WhatsApp messages. Patients call to book, cancel late, and no-shows cost the clinic money. Clinic owners want online booking, automatic reminders, and simple reporting on attendance and revenue per therapist.

Users: clinic owner, receptionist, therapist, patient.
Must have: patient self-booking page, therapist availability calendar, SMS/email reminders, cancellation policy with a cutoff window, basic notes per appointment, export of monthly figures.
Nice to have: waiting list that auto-fills cancellations, insurance claim export, multi-location support.
Constraints: must work on a phone, patient health notes are sensitive, clinics have poor IT support so onboarding has to be almost zero.`,
  },
  {
    id: "prompt",
    label: "Rough prompt",
    hint: "Great for Optimize a Prompt",
    text: `make me a cinematic video of a lighthouse in a storm at night, moody, drone shot, want it to feel lonely but hopeful, maybe 10 seconds, for instagram reels`,
  },
];
