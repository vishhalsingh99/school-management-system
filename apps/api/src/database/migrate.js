import db from "./db.js";

console.log("📦 Running FINAL PRODUCTION migrations...");

/* =====================================================
   0. MIGRATION TRACKING
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    run_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
).run();

/* =====================================================
   1. SCHOOL INFO (ONE TIME)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS school_info (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    logo_path TEXT,
    established_year TEXT
  )
`,
).run();

/* =====================================================
   2. ACADEMIC YEARS
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS academic_years (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    is_active INTEGER DEFAULT 0
  )
`,
).run();

/* =====================================================
   3. CLASSES
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS classes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    order_no INTEGER NOT NULL,
    status INTEGER DEFAULT 1
  )
`,
).run();

db.prepare(
  `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_class_name
  ON classes(name)
`,
).run();

db.prepare(
  `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_class_order
  ON classes(order_no)
`,
).run();

/* =====================================================
   4. SECTIONS
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    capacity INTEGER DEFAULT 40,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
  )
`,
).run();

db.prepare(
  `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_section_per_class
  ON sections(class_id, name)
`,
).run();

/* =====================================================
   5. STUDENTS (STATIC PROFILE)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    reg_no TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    gender TEXT,
    dob TEXT,
    parent_phone TEXT,
    address TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
).run();

db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_students_reg
  ON students(reg_no)
`,
).run();

/* =====================================================
   6. STUDENT ACADEMIC RECORDS (PROMOTION SAFE)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS student_academic_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    academic_year_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    roll_no TEXT,
    status TEXT DEFAULT 'studying',
    is_current INTEGER DEFAULT 0 CHECK (is_current IN (0,1)),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    UNIQUE (student_id, academic_year_id)
  )
`,
).run();

db.prepare(
  `
  CREATE UNIQUE INDEX IF NOT EXISTS idx_one_current_academic
  ON student_academic_records(student_id)
  WHERE is_current = 1
`,
).run();

db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_sar_student_year
  ON student_academic_records(student_id, academic_year_id)
`,
).run();

/* =====================================================
   7. TEACHERS
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    department TEXT,
    phone TEXT,
    email TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`,
).run();

/* =====================================================
   8. SUBJECTS (MASTER)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    is_elective INTEGER DEFAULT 0,
    status INTEGER DEFAULT 1
  )
`,
).run();

/* =====================================================
   9. SUBJECT ASSIGNMENTS (CLASS + SECTION + YEAR)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS subject_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    academic_year_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (section_id) REFERENCES sections(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    UNIQUE (class_id, section_id, subject_id, academic_year_id)
  )
`,
).run();

/* =====================================================
   10. STUDENT SUBJECT ENROLLMENTS (PCM / PCB / OPTIONAL)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS student_subject_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    academic_year_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    UNIQUE (student_id, subject_id, academic_year_id)
  )
`,
).run();

/* =====================================================
   11. ATTENDANCE (DAILY / PERIOD OPTIONAL)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    academic_year_id INTEGER NOT NULL,
    class_id INTEGER NOT NULL,
    section_id INTEGER NOT NULL,
    subject_id INTEGER,
    date TEXT NOT NULL,
    period_no INTEGER,
    status TEXT CHECK (
      status IN ('present','absent','leave','late','half_day')
    ),
    marked_by INTEGER,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    UNIQUE (student_id, date, period_no)
  )
`,
).run();

db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_attendance_lookup
  ON attendance(student_id, date)
`,
).run();

/* =====================================================
   12. EXAMS (HYBRID: CLASS + SCHOOL-WIDE)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS exams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    exam_type TEXT CHECK (
      exam_type IN ('internal','board','improvement')
    ) NOT NULL,
    academic_year_id INTEGER NOT NULL,
    class_id INTEGER NULL,
    is_school_wide INTEGER DEFAULT 0,
    start_date TEXT,
    end_date TEXT,
    status TEXT DEFAULT 'scheduled',
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
  )
`,
).run();

/* =====================================================
   13. EXAM SUBJECTS (THEORY + PRACTICAL)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS exam_subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exam_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    theory_max INTEGER DEFAULT 0,
    theory_pass INTEGER DEFAULT 0,
    practical_max INTEGER DEFAULT 0,
    practical_pass INTEGER DEFAULT 0,
    FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    UNIQUE (exam_id, subject_id)
  )
`,
).run();

/* =====================================================
   14. MARKS (IMPROVEMENT SAFE)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    exam_subject_id INTEGER NOT NULL,
    theory_marks INTEGER,
    practical_marks INTEGER,
    is_absent INTEGER DEFAULT 0 CHECK (is_absent IN (0,1)),
    attempt_no INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (exam_subject_id) REFERENCES exam_subjects(id),
    UNIQUE (student_id, exam_subject_id, attempt_no)
  )
`,
).run();

db.prepare(
  `
  CREATE INDEX IF NOT EXISTS idx_marks_lookup
  ON marks(student_id, exam_subject_id)
`,
).run();

/* =====================================================
   15. FEES (FIXED VERSION)
===================================================== */
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_structures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  class_id INTEGER NOT NULL,
  academic_year_id INTEGER NOT NULL,
  status TEXT DEFAULT 'active',

  UNIQUE (class_id, academic_year_id),

  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

  `
).run()

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_components (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fee_structure_id INTEGER NOT NULL,

  name TEXT NOT NULL,                         -- Tuition / Transport
  frequency TEXT CHECK (
    frequency IN ('monthly','yearly','one_time')
  ) NOT NULL,

  amount INTEGER NOT NULL,                    -- base amount
  is_optional INTEGER DEFAULT 0,              -- transport etc.

  FOREIGN KEY (fee_structure_id)
    REFERENCES fee_structures(id)
    ON DELETE CASCADE
);

  `
).run()

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS student_fee_accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  academic_year_id INTEGER NOT NULL,

  total_fee INTEGER NOT NULL,
  total_discount INTEGER DEFAULT 0,
  total_paid INTEGER DEFAULT 0,
  total_due INTEGER NOT NULL,

  status TEXT DEFAULT 'active',
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (student_id, academic_year_id),

  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

  `
).run()


db.prepare(
  `
  CREATE TABLE IF NOT EXISTS student_fee_dues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  academic_year_id INTEGER NOT NULL,

  component_id INTEGER NOT NULL,
  month INTEGER CHECK (month BETWEEN 1 AND 12),  -- NULL for yearly/one-time

  due_amount INTEGER NOT NULL,
  paid_amount INTEGER DEFAULT 0,

  status TEXT CHECK (
    status IN ('unpaid','partial','paid','waived')
  ) DEFAULT 'unpaid',

  due_date TEXT,
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (student_id, academic_year_id, component_id, month),

  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (component_id) REFERENCES fee_components(id)
);

  `
).run()


db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  academic_year_id INTEGER NOT NULL,

  amount INTEGER NOT NULL,
  mode TEXT CHECK (mode IN ('cash','online','cheque','upi','bank')),
  receipt_no TEXT UNIQUE NOT NULL,

  reference_no TEXT,
  remarks TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (academic_year_id) REFERENCES academic_years(id)
);

  `
).run()


db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_payment_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id INTEGER NOT NULL,
  fee_due_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,

  FOREIGN KEY (payment_id)
    REFERENCES fee_payments(id)
    ON DELETE CASCADE,

  FOREIGN KEY (fee_due_id)
    REFERENCES student_fee_dues(id)
);

  `
).run()

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_discounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL,
  academic_year_id INTEGER NOT NULL,

  component_id INTEGER,     -- NULL = all components
  amount INTEGER NOT NULL,

  reason TEXT,
  approved_by INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (component_id) REFERENCES fee_components(id)
);

  `
).run()


db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  component_id INTEGER NOT NULL,

  name TEXT,                -- Installment 1 / Term 1
  amount INTEGER NOT NULL,
  due_date TEXT NOT NULL,

  FOREIGN KEY (component_id)
    REFERENCES fee_components(id)
);

  `
).run()

db.prepare(
  `
  CREATE TABLE IF NOT EXISTS fee_refunds (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  payment_id INTEGER NOT NULL,

  amount INTEGER NOT NULL,
  reason TEXT,
  refunded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (payment_id)
    REFERENCES fee_payments(id)
);
  `
).run()


/* =====================================================
   16. USERS (AUTH – BASIC)
===================================================== */
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin','teacher')) NOT NULL
  )
`).run();

/* =====================================================
   17. CLASS TEACHERS
===================================================== */
db.prepare(`
  CREATE TABLE IF NOT EXISTS class_teachers (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id       INTEGER NOT NULL,
    class_id         INTEGER NOT NULL,
    section_id       INTEGER NOT NULL,
    academic_year_id INTEGER NOT NULL,
    assigned_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id)       REFERENCES teachers(id),
    FOREIGN KEY (class_id)         REFERENCES classes(id),
    FOREIGN KEY (section_id)       REFERENCES sections(id),
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
    
    UNIQUE (teacher_id),
    UNIQUE (class_id, section_id, academic_year_id)
  )
`).run();

console.log("✅ FINAL PRODUCTION migrations completed successfully");