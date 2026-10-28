const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  ImageRun, Header, Footer, PageNumber,
  LevelFormat, VerticalAlign, TabStopType, TabStopPosition
} = require("docx");

const NAVY = "1B3A57";
const FONT = "Times New Roman";
const L15 = { line: 360, lineRule: "auto" };   // 1.5 spacing for running text
const L10 = { line: 248, lineRule: "auto" };   // ~single spacing for compact elements

// ---------- helpers -------------------------------------------------

function bodyPar(text, opts = {}) {
  return new Paragraph({
    alignment: opts.center ? AlignmentType.CENTER : AlignmentType.JUSTIFIED,
    spacing: { ...L15, after: 100, ...(opts.spacing || {}) },
    indent: opts.indent,
    children: Array.isArray(text) ? text : [new TextRun({ text, font: FONT, size: 24, bold: opts.bold, italics: opts.italics })],
  });
}

function chapterHeading(num, title, pageBreakBefore = true) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    pageBreakBefore,
    spacing: { after: 140 },
    children: [new TextRun({ text: `Chapter ${num}: ${title}`, font: FONT, bold: true, size: 30, color: NAVY })],
  });
}

function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 140, after: 80 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 26, color: NAVY })],
  });
}

function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 100, after: 60 },
    children: [new TextRun({ text, font: FONT, bold: true, italics: true, size: 23 })],
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullet-list", level: 0 },
    spacing: { ...L10, after: 40 },
    children: [new TextRun({ text, font: FONT, size: 23 })],
  });
}

function figureCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 40, after: 140 },
    children: [new TextRun({ text, font: FONT, size: 21, bold: true, color: NAVY })],
  });
}

function tableCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { before: 100, after: 60 },
    children: [new TextRun({ text, font: FONT, size: 22, bold: true, color: NAVY })],
  });
}

function imageParagraph(path, widthPx, heightPx) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 60, after: 20 },
    children: [
      new ImageRun({
        type: path.endsWith("jpg") || path.endsWith("jpeg") ? "jpg" : "png",
        data: fs.readFileSync(path),
        transformation: { width: widthPx, height: heightPx },
      }),
    ],
  });
}

function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, fill: "1B3A57" } : (opts.alt ? { type: ShadingType.CLEAR, fill: "EAF2FB" } : undefined),
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 100, right: 100 },
    children: [new Paragraph({
      alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { line: 240, lineRule: "auto", after: 0 },
      children: [new TextRun({ text, font: FONT, size: 20, bold: !!opts.header, color: opts.header ? "FFFFFF" : "000000" })],
    })],
  });
}

function makeTable(headers, rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: "1B3A57" },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "1B3A57" },
      left: { style: BorderStyle.SINGLE, size: 4, color: "1B3A57" },
      right: { style: BorderStyle.SINGLE, size: 4, color: "1B3A57" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "AAB4C0" },
      insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "AAB4C0" },
    },
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => cell(h, { header: true, center: true, width: colWidths[i] })),
      }),
      ...rows.map((r, ridx) => new TableRow({
        children: r.map((c, i) => cell(c, { alt: ridx % 2 === 1, center: i !== 0, width: colWidths[i] })),
      })),
    ],
  });
}

function dotLeaderTocLine(title, page, level = 0) {
  return new Paragraph({
    spacing: { line: 232, lineRule: "auto", after: level === 0 ? 70 : 40 },
    indent: { left: level * 320 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: "dot" }],
    children: [
      new TextRun({ text: title, font: FONT, size: level === 0 ? 22 : 20, bold: level === 0 }),
      new TextRun({ text: `\t${page}`, font: FONT, size: level === 0 ? 22 : 20, bold: level === 0 }),
    ],
  });
}

function prelimHeading(text, pageBreakBefore = false) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    pageBreakBefore,
    spacing: { before: 160, after: 140 },
    children: [new TextRun({ text, font: FONT, bold: true, size: 28, color: NAVY })],
  });
}

// ---------- document assembly ---------------------------------------

const doc = new Document({
  numbering: {
    config: [{
      reference: "bullet-list",
      levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 460, hanging: 220 } } } }],
    }],
  },
  styles: {
    default: {
      document: { run: { font: FONT, size: 24 }, paragraph: { spacing: { ...L15 } } },
    },
  },
  sections: [
    // ============= SECTION 1: COVER =============
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1300, bottom: 1300, left: 2160, right: 1440 },
        },
      },
      children: [
        new Paragraph({ spacing: { after: 160 }, alignment: AlignmentType.CENTER,
          children: [new ImageRun({ type: "jpg", data: fs.readFileSync("img/logo.jpg"), transformation: { width: 95, height: 95 } })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 0 },
          children: [new TextRun({ text: "AHMEDABAD INSTITUTE OF TECHNOLOGY", font: FONT, bold: true, size: 30, color: NAVY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: "Department of Computer Engineering", font: FONT, bold: true, size: 26 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 },
          children: [new TextRun({ text: "Semester 5 \u2013 Project Management (BE05000481)", font: FONT, italics: true, size: 22 })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 100 },
          children: [new TextRun({ text: "A Project Report on", font: FONT, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100, after: 60 },
          children: [new TextRun({ text: "\u201cAQI ANALYSIS AND PREDICTION DASHBOARD", font: FONT, bold: true, size: 30, color: NAVY })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 0, after: 500 },
          children: [new TextRun({ text: "USING MACHINE LEARNING\u201d", font: FONT, bold: true, size: 30, color: NAVY })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 }, indent: { left: 400, right: 400 },
          children: [new TextRun({ text: "Submitted in partial fulfilment of the Problem Based Learning (PBL) Activity for the subject Project Management (BE05000481), B.E. Semester 5, Computer Engineering", font: FONT, italics: true, size: 22 })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: "Submitted by", font: FONT, bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: "Het Patel  \u2013  [Enrollment No.]", font: FONT, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 },
          children: [new TextRun({ text: "[Second Student Name]  \u2013  [Enrollment No.]", font: FONT, size: 24 })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 },
          children: [new TextRun({ text: "Guided by", font: FONT, bold: true, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 },
          children: [new TextRun({ text: "Dr. Apeksha Dave", font: FONT, size: 24 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 500 },
          children: [new TextRun({ text: "Subject Faculty & Subject Co-ordinator", font: FONT, italics: true, size: 22 })] }),

        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 500, after: 0 },
          children: [new TextRun({ text: "Department of Computer Engineering", font: FONT, size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 },
          children: [new TextRun({ text: "Ahmedabad Institute of Technology", font: FONT, size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "2026", font: FONT, size: 22 })] }),
      ],
    },

    // ============= SECTION 2: PRELIMINARY PAGES =============
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1300, bottom: 1300, left: 2160, right: 1440 },
          pageNumberStart: 1,
        },
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] })] }),
      },
      children: [
        prelimHeading("Acknowledgement", false),
        bodyPar("I would like to express my sincere gratitude to my subject faculty and Project Management coordinator, Dr. Apeksha Dave, for her invaluable guidance and constant support throughout this Problem Based Learning (PBL) activity, and to Dr. Harsha Padheriya, Head of the Department of Computer Engineering, for providing the resources and environment that made this work possible."),
        bodyPar("I also thank the faculty of the Department of Computer Engineering, Ahmedabad Institute of Technology, my classmates, and my family for their continuous encouragement during the development of this project."),

        prelimHeading("Abstract", false),
        bodyPar("Air pollution is a critical environmental and public health concern in urban India, and the Air Quality Index (AQI) is the standard metric used to communicate pollution severity. This project, \u201cAQI Analysis and Prediction Dashboard using Machine Learning,\u201d predicts AQI from pollutant concentration data and presents it through an interactive web dashboard."),
        bodyPar("Using the \u201cAir Quality Data in India (2015\u20132020)\u201d dataset (29,531 records across 26 cities), four regression algorithms were trained and compared. A Random Forest Regressor, tuned via GridSearchCV, gave the best result (R\u00b2 = 0.911) and was deployed through a Streamlit dashboard that returns the predicted AQI, its category, a health advisory, and pollutant-wise status for any set of user-entered readings."),
        bodyPar("The report also documents the project from a project-management perspective \u2013 planning, scheduling, work breakdown, risk and stakeholder analysis \u2013 as required for the Project Management (BE05000481) PBL activity."),
        bodyPar([new TextRun({ text: "Keywords: ", font: FONT, bold: true, size: 24 }), new TextRun({ text: "Air Quality Index, Machine Learning, Random Forest, Streamlit, Project Management", font: FONT, size: 24, italics: true })]),

        prelimHeading("Table of Contents", true),
        dotLeaderTocLine("Acknowledgement", "i"),
        dotLeaderTocLine("Abstract", "i"),
        dotLeaderTocLine("List of Figures", "iii"),
        dotLeaderTocLine("List of Tables", "iii"),
        dotLeaderTocLine("List of Abbreviations", "iv"),
        dotLeaderTocLine("Chapter 1: Introduction", "1"),
        dotLeaderTocLine("1.1 Overview", "1", 1),
        dotLeaderTocLine("1.2 Project Background", "1", 1),
        dotLeaderTocLine("1.3 Problem Statement", "1", 1),
        dotLeaderTocLine("1.4 Need for the Project", "1", 1),
        dotLeaderTocLine("1.5 Objectives", "1", 1),
        dotLeaderTocLine("1.6 Scope of the Project", "1", 1),
        dotLeaderTocLine("1.7 Project Limitations", "1", 1),
        dotLeaderTocLine("Chapter 2: Project Planning", "2"),
        dotLeaderTocLine("2.1\u20132.3 Methodology, Plan & Life Cycle", "2", 1),
        dotLeaderTocLine("2.4 Work Breakdown Structure (WBS)", "2", 1),
        dotLeaderTocLine("2.5 Gantt Chart", "2", 1),
        dotLeaderTocLine("2.6 PERT/CPM Network Diagram", "2", 1),
        dotLeaderTocLine("2.7 Budget Estimation", "3", 1),
        dotLeaderTocLine("2.8 Resource Allocation", "3", 1),
        dotLeaderTocLine("2.9 Risk Analysis", "3", 1),
        dotLeaderTocLine("2.10 Stakeholder Analysis", "3", 1),
        dotLeaderTocLine("Chapter 3: System Design", "4"),
        dotLeaderTocLine("3.1 System Architecture", "4", 1),
        dotLeaderTocLine("3.2 Use Case Diagram", "4", 1),
        dotLeaderTocLine("3.3 Entity Relationship (ER) Diagram", "5", 1),
        dotLeaderTocLine("3.4 Communication Plan", "5", 1),
        dotLeaderTocLine("3.5 Quality Management Plan", "5", 1),
        dotLeaderTocLine("3.6 Project Monitoring and Control", "5", 1),
        dotLeaderTocLine("Chapter 4: Results and Discussion", "6"),
        dotLeaderTocLine("4.1 Expected Results", "6", 1),
        dotLeaderTocLine("4.2 Advantages", "6", 1),
        dotLeaderTocLine("4.3 Limitation", "7", 1),
        dotLeaderTocLine("4.4 Future Scope", "7", 1),
        dotLeaderTocLine("4.5 Conclusion", "7", 1),
        dotLeaderTocLine("References", "8"),
        dotLeaderTocLine("Appendix A: Work Breakdown Structure (WBS)", "9"),
        dotLeaderTocLine("Appendix B: Gantt Chart", "10"),
        dotLeaderTocLine("Appendix C: PERT/CPM Network Diagram", "11"),

        prelimHeading("List of Figures", true),
        dotLeaderTocLine("Figure 2.1: Waterfall Project Management Model", "2", 1),
        dotLeaderTocLine("Figure 3.1: System Architecture of the AQI Analysis Dashboard", "4", 1),
        dotLeaderTocLine("Figure 3.2: Use Case Diagram", "4", 1),
        dotLeaderTocLine("Figure 3.3: Entity Relationship (ER) Diagram", "5", 1),
        dotLeaderTocLine("Figure 4.1: Model Performance Comparison (R\u00b2 Score)", "6", 1),
        dotLeaderTocLine("Figure A.1: Work Breakdown Structure", "9", 1),
        dotLeaderTocLine("Figure B.1: Project Gantt Chart", "10", 1),
        dotLeaderTocLine("Figure C.1: PERT/CPM Network Diagram", "11", 1),

        new Paragraph({ heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { before: 200, after: 140 },
          children: [new TextRun({ text: "List of Tables", font: FONT, bold: true, size: 28, color: NAVY })] }),
        dotLeaderTocLine("Table 1.1: AQI Categories and Health Advisory", "1", 1),
        dotLeaderTocLine("Table 2.1: Budget Estimation", "3", 1),
        dotLeaderTocLine("Table 2.2: Resource Allocation", "3", 1),
        dotLeaderTocLine("Table 2.3: Risk Analysis", "3", 1),
        dotLeaderTocLine("Table 2.4: Stakeholder Analysis", "3", 1),
        dotLeaderTocLine("Table 3.1: Communication Plan", "5", 1),
        dotLeaderTocLine("Table 4.1: Model Performance Comparison", "6", 1),
        dotLeaderTocLine("Table 4.2: Top Contributing Features", "6", 1),

        prelimHeading("List of Abbreviations", true),
        makeTable(
          ["Abbreviation", "Full Form"],
          [
            ["AQI", "Air Quality Index"],
            ["ML", "Machine Learning"],
            ["CPCB", "Central Pollution Control Board"],
            ["PM2.5 / PM10", "Particulate Matter (\u2264 2.5 \u03bcm / \u2264 10 \u03bcm)"],
            ["NOx / NO / NO2", "Oxides of Nitrogen"],
            ["SO2 / CO / O3 / NH3", "Sulphur Dioxide / Carbon Monoxide / Ozone / Ammonia"],
            ["R\u00b2 / MAE / RMSE", "Coefficient of Determination / Mean Absolute Error / Root Mean Squared Error"],
            ["WBS", "Work Breakdown Structure"],
            ["PERT / CPM", "Program Evaluation & Review Technique / Critical Path Method"],
            ["ER Diagram", "Entity Relationship Diagram"],
            ["UI / CSV", "User Interface / Comma Separated Values"],
          ],
          [3200, 6570]
        ),
      ],
    },

    // ============= SECTION 3: MAIN BODY =============
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1300, bottom: 1300, left: 2160, right: 1440 },
          pageNumberStart: 1,
        },
      },
      headers: {
        default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "AQI Analysis and Prediction Dashboard", font: FONT, size: 17, italics: true, color: "666666" })] })] }),
      },
      footers: {
        default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] })] }),
      },
      children: [
        // ================= CHAPTER 1 =================
        chapterHeading(1, "Introduction", false),

        subHeading("1.1 Overview"),
        bodyPar("Air quality is a pressing environmental concern in Indian cities. The Air Quality Index (AQI) condenses the concentration of pollutants \u2013 PM2.5, PM10, NO, NO2, NOx, NH3, CO, SO2, O3, Benzene, Toluene and Xylene \u2013 into one number that reflects health risk. This project builds a machine-learning system that predicts AQI from these pollutant readings and presents the result through an interactive Streamlit dashboard."),

        subHeading("1.2 Project Background"),
        bodyPar("The project uses the public \u201cAir Quality Data in India (2015\u20132020)\u201d dataset \u2013 29,531 day-wise records from 26 Indian cities. Four regression algorithms were trained and compared, and the best model, a tuned Random Forest Regressor, was deployed as the dashboard's prediction engine."),

        subHeading("1.3 Problem Statement"),
        bodyPar("Raw pollutant readings are not directly meaningful to the public. Citizens need a quick way to know what a set of readings implies for AQI, its severity category, and precautions to take \u2013 particularly when the officially reported AQI for a location or date is missing."),

        subHeading("1.4 Need for the Project"),
        bodyPar("Accessible air-quality information helps individuals plan outdoor activity and helps institutions plan interventions. A predictive dashboard fills gaps in official reporting and demonstrates applied machine learning on a real environmental dataset."),

        subHeading("1.5 Objectives"),
        bullet("Clean and analyse a multi-city, multi-year air quality dataset."),
        bullet("Train and compare multiple regression models for AQI prediction."),
        bullet("Identify pollutants most strongly associated with AQI via correlation and feature importance."),
        bullet("Tune and finalize the best model using cross-validated hyperparameter search."),
        bullet("Build a dashboard for prediction, category, health advice and pollutant status."),

        subHeading("1.6 Scope of the Project"),
        bodyPar("The scope spans the full pipeline \u2013 preprocessing, EDA, model training, tuning and a Streamlit front end \u2013 limited to the 26 cities and twelve pollutants present in the training dataset."),

        subHeading("1.7 Project Limitations"),
        bullet("Bound by historical data (2015\u20132020); not a real-time sensor feed."),
        bullet("Supports only the 26 cities present in the training data."),
        bullet("Sparsely recorded pollutants (e.g. Xylene, >50% missing) were median-imputed, slightly understating variability."),

        tableCaption("Table 1.1: AQI Categories and Health Advisory"),
        makeTable(
          ["AQI Range", "Category", "General Health Advisory"],
          [
            ["0\u201350", "Good", "Minimal impact; satisfactory air quality."],
            ["51\u2013100", "Satisfactory", "Minor discomfort to sensitive people."],
            ["101\u2013200", "Moderate", "Discomfort to people with lung/heart disease, children, older adults."],
            ["201\u2013300", "Poor", "Discomfort on prolonged exposure for most people."],
            ["301\u2013400", "Very Poor", "Respiratory illness on prolonged exposure."],
            ["401\u2013500", "Severe", "Affects healthy people; serious for those with existing conditions."],
          ],
          [1800, 1800, 6170]
        ),

        // ================= CHAPTER 2 =================
        chapterHeading(2, "Project Planning"),

        subHeading("2.1\u20132.3 Methodology, Project Plan & Life Cycle"),
        bodyPar("The project followed the Waterfall model (Figure 2.1), since requirements \u2013 a fixed dataset, defined pollutants, and a clear deliverable \u2013 were well understood upfront. It was planned over a seven-week schedule spanning requirement study, data collection, preprocessing, EDA, model development, evaluation/tuning, application development, testing and documentation (Appendix B), moving through six life-cycle stages: requirement analysis, design, implementation, testing, deployment and maintenance."),
        imageParagraph("img/waterfall.png", 380, 165),
        figureCaption("Figure 2.1: Waterfall Project Management Model"),

        subHeading("2.4\u20132.6 WBS, Gantt Chart & PERT/CPM"),
        bodyPar("The project was decomposed into six work packages (data collection, preprocessing, EDA, model development/evaluation, application development, testing/deployment), each with concrete sub-tasks \u2013 see the Work Breakdown Structure in Appendix A. These tasks are scheduled on the Gantt chart in Appendix B. A PERT/CPM network (Appendix C) identifies the critical path \u2013 Requirement Study \u2192 Data Collection \u2192 Preprocessing \u2192 Model Development \u2192 Evaluation & Tuning \u2192 Application Development \u2192 Testing & Deployment \u2192 Documentation \u2013 with a total duration of 42 days."),

        tableCaption("Table 2.1: Budget Estimation"),
        makeTable(
          ["Cost Head", "Estimated Cost (\u20b9)", "Remarks"],
          [
            ["Computing Resources", "3,000", "Training/notebook usage"],
            ["Internet & Data Access", "1,000", "Dataset & documentation"],
            ["Software & Tools", "0", "Python, scikit-learn, Streamlit (open-source)"],
            ["Contingency", "1,000", "Printing, buffer"],
          ],
          [2600, 2100, 4670]
        ),

        tableCaption("Table 2.2: Resource Allocation"),
        makeTable(
          ["Resource", "Role / Allocation"],
          [
            ["Student 1", "Data preprocessing, EDA, model development & tuning"],
            ["Student 2", "Streamlit application development, testing, documentation"],
            ["Subject Faculty", "Guidance and periodic evaluation"],
          ],
          [2400, 6970]
        ),

        tableCaption("Table 2.3: Risk Analysis"),
        makeTable(
          ["Risk", "Likelihood", "Impact", "Mitigation"],
          [
            ["Missing pollutant data", "High", "Medium", "Median imputation; drop rows missing AQI"],
            ["Model overfitting", "Medium", "Medium", "Train-test split + cross-validation"],
            ["Invalid dashboard input", "Medium", "Low", "Input validation, numeric bounds"],
            ["Schedule delay", "Low", "Medium", "Buffer time in Gantt schedule"],
          ],
          [2600, 1500, 1300, 3970]
        ),

        tableCaption("Table 2.4: Stakeholder Analysis"),
        makeTable(
          ["Stakeholder", "Interest", "Influence"],
          [
            ["Project Team", "Successful completion, learning outcomes", "High"],
            ["Subject Faculty", "Academic quality, adherence to guidelines", "High"],
            ["End Users", "Accurate, easy-to-understand predictions", "Medium"],
          ],
          [2600, 4800, 1970]
        ),

        // ================= CHAPTER 3 =================
        chapterHeading(3, "System Design"),

        subHeading("3.1 System Architecture"),
        bodyPar("The system uses a layered architecture from raw data through preprocessing, machine learning and application logic to the dashboard (Figure 3.1). The Streamlit app (app.py) consumes the trained model artefacts (aqi_model.pkl, city_encoder.pkl) through utils/predictor.py, decoupled from the model-training pipeline."),
        imageParagraph("img/architecture.png", 400, 240),
        figureCaption("Figure 3.1: System Architecture of the AQI Analysis Dashboard"),

        subHeading("3.2 Use Case Diagram"),
        bodyPar("The primary actor is the End User, who selects a city, enters pollutant concentrations and a date, and requests a prediction; the system returns the AQI, its category, a health advisory and pollutant-wise status (Figure 3.2)."),
        imageParagraph("img/usecase.png", 350, 210),
        figureCaption("Figure 3.2: Use Case Diagram"),

        subHeading("3.3 Entity Relationship (ER) Diagram"),
        bodyPar("The dataset can be modelled as two related entities \u2013 CITY (city identifier and name) and AIR_QUALITY_RECORD (date-wise pollutant readings and AQI) \u2013 in a one-to-many relationship (Figure 3.3)."),
        imageParagraph("img/erd.png", 380, 190),
        figureCaption("Figure 3.3: Entity Relationship (ER) Diagram"),

        subHeading("3.4 Communication Plan"),
        tableCaption("Table 3.1: Communication Plan"),
        makeTable(
          ["Stakeholder", "Mode", "Frequency", "Purpose"],
          [
            ["Subject Faculty", "In-person / email", "Weekly", "Progress review"],
            ["Project Team", "In-person / chat", "Daily (active phases)", "Task coordination"],
          ],
          [2400, 2200, 2400, 2170]
        ),

        subHeading("3.5 Quality Management Plan"),
        bodyPar("Quality was ensured by validating each preprocessing step, comparing multiple algorithms instead of committing early, and using 5-fold GridSearchCV for objective hyperparameter selection. The final model was accepted only after verifying MAE, RMSE and R\u00b2 on a held-out 20% test split."),

        subHeading("3.6 Project Monitoring and Control"),
        bodyPar("Progress was tracked against the Gantt schedule (Appendix B), with evaluation metrics serving as checkpoints; underperformance would trigger a return to feature selection or tuning before proceeding further."),

        // ================= CHAPTER 4 =================
        chapterHeading(4, "Results and Discussion"),

        subHeading("4.1 Expected Results"),
        bodyPar("Four regression models were trained on an 80/20 split and evaluated on the held-out test set. The Random Forest Regressor, tuned via 5-fold GridSearchCV, gave the best result and was selected as the final model."),

        tableCaption("Table 4.1: Model Performance Comparison"),
        makeTable(
          ["Model", "MAE", "RMSE", "R\u00b2 Score"],
          [
            ["Linear Regression", "30.99", "59.27", "0.808"],
            ["Decision Tree", "28.29", "55.99", "0.829"],
            ["Gradient Boosting", "23.39", "43.24", "0.898"],
            ["Random Forest (Tuned)", "20.44", "40.38", "0.911"],
          ],
          [3100, 2000, 2000, 2170]
        ),

        imageParagraph("img/model_comparison.png", 330, 200),
        figureCaption("Figure 4.1: Model Performance Comparison (R\u00b2 Score)"),

        tableCaption("Table 4.2: Top Contributing Features (Random Forest)"),
        makeTable(
          ["Rank", "Feature", "Importance"],
          [
            ["1", "PM2.5", "48.4%"],
            ["2", "CO", "36.1%"],
            ["3", "PM10", "4.7%"],
          ],
          [1270, 3900, 4100]
        ),
        bodyPar("PM2.5 and CO together account for over 84% of the model's predictive importance, consistent with the correlation analysis (PM10 r=0.80, CO r=0.68, PM2.5 r=0.66 with AQI)."),

        subHeading("4.2 Advantages"),
        bullet("Instant AQI prediction and interpretation without waiting for official reporting."),
        bullet("Random Forest model generalizes well (R\u00b2 = 0.911) across 26 cities, five years of data."),
        bullet("Interactive dashboard needs no technical knowledge to operate."),

        subHeading("4.3 Limitation"),
        bullet("Depends on historical data completeness; some pollutants had >50% missing values."),
        bullet("No real-time meteorological factors (wind, temperature) considered."),
        bullet("Restricted to the 26 cities in the training dataset."),

        subHeading("4.4 Future Scope"),
        bullet("Integrate a live weather/AQI API for real-time predictions."),
        bullet("Add AQI trend visualization and time-series forecasting."),
        bullet("Add downloadable PDF reports and user authentication."),

        subHeading("4.5 Conclusion"),
        bodyPar("This project demonstrates machine learning applied to a real environmental problem. Combining systematic project management \u2013 planning, scheduling, risk and stakeholder analysis \u2013 with a rigorous data-science workflow, the team delivered a Random Forest based AQI dashboard achieving R\u00b2 = 0.911, reinforcing both ML and structured project-management skills from the Project Management (BE05000481) course."),

        // ================= REFERENCES =================
        new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, spacing: { after: 180 },
          children: [new TextRun({ text: "References", font: FONT, bold: true, size: 30, color: NAVY })] }),
        bodyPar("1.  Kaggle Dataset: \u201cAir Quality Data in India (2015\u20132020),\u201d city_day.csv, CPCB monitoring stations.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),
        bodyPar("2.  Central Pollution Control Board (CPCB), National Air Quality Index methodology, cpcb.nic.in.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),
        bodyPar("3.  Scikit-learn Developers, Scikit-learn: Machine Learning in Python, scikit-learn.org.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),
        bodyPar("4.  Streamlit Inc., Streamlit Documentation, docs.streamlit.io.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),
        bodyPar("5.  Pandas Development Team, pandas documentation, pandas.pydata.org/docs.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),
        bodyPar("6.  Pedregosa, F. et al., \u201cScikit-learn: Machine Learning in Python,\u201d JMLR, 12, 2011.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),
        bodyPar("7.  Ahmedabad Institute of Technology, Dept. of Computer Engineering, PBL Activity Guidelines \u2013 Project Management (BE05000481), 2026.", { spacing: { ...L10, after: 60 }, indent: { left: 360, hanging: 360 } }),

        // ================= APPENDICES =================
        new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, spacing: { after: 160 },
          children: [new TextRun({ text: "Appendix A: Work Breakdown Structure (WBS)", font: FONT, bold: true, size: 28, color: NAVY })] }),
        bodyPar("The complete work breakdown structure decomposes the project into six major work packages, each with two representative sub-tasks (Figure A.1)."),
        imageParagraph("img/wbs.png", 470, 275),
        figureCaption("Figure A.1: Work Breakdown Structure"),

        new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 160 },
          children: [new TextRun({ text: "Appendix B: Gantt Chart", font: FONT, bold: true, size: 28, color: NAVY })] }),
        bodyPar("The Gantt chart maps the nine major project tasks onto a seven-week calendar schedule, from requirement study through report documentation."),
        imageParagraph("img/gantt.png", 470, 220),
        figureCaption("Figure B.1: Project Gantt Chart"),

        new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: true, spacing: { after: 160 },
          children: [new TextRun({ text: "Appendix C: PERT/CPM Network Diagram", font: FONT, bold: true, size: 28, color: NAVY })] }),
        bodyPar("The network diagram identifies task dependencies and highlights the critical path (red), which determines the minimum total project duration of 42 days."),
        imageParagraph("img/pert.png", 500, 220),
        figureCaption("Figure C.1: PERT/CPM Network Diagram"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("AQI_Analysis_PM_Report.docx", buffer);
  console.log("Report written.");
});
