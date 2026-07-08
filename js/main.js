// Customize right-click menu

/* VARIABLES */
const TEXT_OFFSET = 0;
const CHAR_SIZE = 9.594;

const version = "v1.2.1";
var reader = new FileReader();
// 20 chars
// 191.5px
// 20 chars * 9.1203 = 182.406
// 182.406 + 10.094
const prefixText = `[t1]you[/t1][t2]@[/t2][t3]sebterm-${version} $ [/t3]`;
/* END OF VARIABLES */

const output = document.getElementById("output");
const input = document.getElementById("terminalInput");
const prefix = document.getElementById("prefix");
const autocomplete = document.querySelector("div#autocomplete");
let lengthOfPrefix = 0;

let availableCommands = [
  "help",
  "clear",
  "startup",
  "credits",
  "history",
  "repo",
  "changelog",
  "work",
  "work LeadSiteReliabilityEngineer",
  "work LeadPlatformEngineer",
  "work SeniorDevOpsEngineer",
  "work PlatformEngineer",
  "work DevOpsEngineer",
  "work TechnicalConsultant",
  "work ComputerVolunteer",
  "skills",
  "education",
  "contact",
  "all",
  "",
]; // Sets the available commands for the red stuff to work.

let advancedAvailableCommands = ["cv"];

let commands = [];
let backIndex = 0;

function addRawLine(text) {
  output.innerHTML = output.innerHTML + text;
}
function colorize(text) {
  let colorizedText = text;
  colorizedText = colorizedText
    .replaceAll("[cr]", '<div class="colour red-stuff">')
    .replaceAll("[/cr]", "</div>"); // RED
  colorizedText = colorizedText
    .replaceAll("[cb]", '<div class="colour blue-stuff">')
    .replaceAll("[/cb]", "</div>"); // BLUE
  colorizedText = colorizedText
    .replaceAll("[cy]", '<div class="colour yellow-stuff">')
    .replaceAll("[/cy]", "</div>"); // YELLOW
  colorizedText = colorizedText
    .replaceAll("[cg]", '<div class="colour green-stuff">')
    .replaceAll("[/cg]", "</div>"); // GREEN
  colorizedText = colorizedText
    .replaceAll("[clb]", '<div class="colour lightblue-stuff">')
    .replaceAll("[/clb]", "</div>"); // LIGHT BLUE
  colorizedText = colorizedText
    .replaceAll("[clg]", '<div class="colour lightgreen-stuff">')
    .replaceAll("[/clg]", "</div>"); // LIGHT BLUE
  colorizedText = colorizedText
    .replaceAll("[t1]", '<div class="colour term1-stuff">')
    .replaceAll("[/t1]", "</div>");
  colorizedText = colorizedText
    .replaceAll("[t2]", '<div class="colour term2-stuff">')
    .replaceAll("[/t2]", "</div>");
  colorizedText = colorizedText
    .replaceAll("[t3]", '<div class="colour term3-stuff">')
    .replaceAll("[/t3]", "</div>");

  if (colorizedText.match(/\[click-\w+\]/g)) {
    const cmdName = colorizedText
      .match(/\[click-\w+\]/g)[0]
      .replace("[click-", "")
      .replace("]", "");
    // console.log(cmdName);
    colorizedText = colorizedText.replaceAll(
      `[click-${cmdName}]`,
      `<div class='inline click' woofclick='${cmdName}'>`
    );
  }
  if (colorizedText.match(/\[click2-work-\w+\]/g)) {
    const cmdName = colorizedText
      .match(/\[click2-work-\w+\]/g)[0]
      .replace("[click2-work-", "")
      .replace("]", "");
    // console.log(cmdName);
    colorizedText = colorizedText.replaceAll(
      `[click2-work-${cmdName}]`,
      `<div class='inline click' woofclick='work ${cmdName}'>`
    );
  }
  if (
    colorizedText.match(
      /\[link-https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\]/g
    )
  ) {
    colorizedText
      .match(
        /\[link-https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\]/g
      )
      .forEach((element) => {
        const linkUrl = element.replace("[link-", "").replace("]", "");
        // console.log(cmdName);
        colorizedText = colorizedText.replaceAll(
          `[link-${linkUrl}]`,
          `<a href="${linkUrl}" target=\"_blank">`
        );
      });
  }
  colorizedText = colorizedText.replaceAll("[/link]", "</a>");
  colorizedText = colorizedText.replaceAll("[/click]", "</div>");
  if (colorizedText.match(/\[\d+s\/\]/g)) {
    colorizedText.match(/\[\d+s\/\]/g).forEach((element) => {
      let numOfSpaces = element.replace(/(\[|s|\/|\])/g, "");

      if (numOfSpaces.match(/\d+/g)) {
        let spaces = "";
        for (var i = 0; i < parseInt(numOfSpaces); i++) {
          spaces = spaces + "[s/]";
          //   console.log(spaces);
        }
        colorizedText = colorizedText.replace(
          "[" + numOfSpaces + "s/]",
          spaces
        );
      }
    });
  } // I don't know how to read this, i wrote it btw

  colorizedText = colorizedText.replaceAll("[n/]", "<br/>");
  colorizedText = colorizedText.replaceAll("[s/]", "&nbsp;");
  colorizedText = colorizedText.replaceAll("[&09&]", "");

  return colorizedText;
}
function addLine(text) {
  addRawLine('<div class="line">' + colorize(text) + "</div>");
}
function clearOutput() {
  output.innerHTML = "";
}
function setInput(text) {
  input.value = text;
  var that = input;
  setTimeout(function () {
    that.selectionStart = that.selectionEnd = 10000;
  }, 0);
  const event = new Event("input");
  input.dispatchEvent(event);
}
function refocus() {
  input.focus();
}
function checkIfStringStartsWith(str, substrs) {
  return substrs.some((substr) => str.startsWith(substr));
}

function commandExists(command) {
  let preppedCommand = command.toLowerCase();
  let preppedAvailableCommands = availableCommands.map(v => v.toLowerCase());
  return (
    preppedAvailableCommands.indexOf(preppedCommand) >= 0 ||
    checkIfStringStartsWith(preppedCommand, advancedAvailableCommands)
  );
}
commandExists("hello");
function addCommandLine() {
  const doesCommandExists = commandExists(input.value);
  addLine(
    prefixText +
      (doesCommandExists
        ? input.value
        : "<div class='error inline'>" + input.value + "</div>")
  );
}
function openCv() {
  window.open('files/SebastianLewisCV2026.pdf', "_blank").focus();
}
function workHelpCommand(cmd, desc) {
  addLine(`[clb][click2-work-${cmd}]${cmd}[/click][/clb][n/][3s/]${desc}`);
}
function helpCommand(cmd, desc) {
  let trimcmd = cmd.split(' ')[0]
  addLine(`[clb][click-${trimcmd}]${cmd}[/click][/clb][n/][3s/]${desc}`);
}
function stextLength(text) {
  cleanText = colorize(text).replace(/<\/?[^>]+(>|$)/g, "");
  return cleanText.length;
}
input.addEventListener("input", (event) => {
  event.target.setAttribute(
    "size",
    event.target.value.length < 1 ? 1 : event.target.value.length
  );
  event.target.setAttribute(
    "maxlength",
    event.target.value.length < 1 ? 3 : event.target.value.length + 2
  );
  //   console.log(event.target.value);
  if (commandExists(event.target.value)) {
    try {
      event.target.classList.remove("error");
    } catch {}
  } else {
    event.target.classList.add("error");
  }
  let clear = true;

  if (clear) {
    autocomplete.innerHTML = "";
  }

  if (input.value != "") {
    preppedInput=input.value.toLowerCase();
    let preppedAvailableCommands = availableCommands.map(v => v.toLowerCase());
    for (var i = 0; i < availableCommands.length; i++) {
      if (
        preppedAvailableCommands[i].startsWith(preppedInput) &&
        preppedAvailableCommands[i] != preppedInput
      ) {
        // console.log(availableCommands[i]);
        autocomplete.innerHTML = availableCommands[i];
        break;
      }
    }
  } else {
    autocomplete.innerHTML = "";
  }
});


clearOutput();

prefix.innerHTML = colorize(prefixText);
function advancedCommands(cmd) {
  let command = cmd.split(" ")[0];
  let args = cmd.split(" ");
  args.shift();

  switch (command) {
    case "cv":
      addLine(
        `[cg]Opening cv...[/cg]`
      );
      openCv();
      break;
    default:
      return false;
  }
  return true;
}
function commandHandler(command, cmdline = true) {
  if (cmdline) addCommandLine();
  backIndex = 0;

  switch (command.toLowerCase()) {
    case "help":
      helpCommand("help", "Outputs help message (AKA [cb]this[/cb])");
      helpCommand("all", "Print all top level details on the website");
      helpCommand("work", "List of my work experience roleIds");
      helpCommand("work [roleid]", "Details my work experience for a given [roleId]");
      helpCommand("skills", "Summary of technologies I've worked with and would consider myself skilled in");
      helpCommand("eduction", "Summary of my education");
      helpCommand("contact", "Contact details");
      helpCommand("cv", "Opens a copy of my cv for less interactive reading");
      helpCommand("clear", "Clear the screen");
      helpCommand("history", "Shows command history of current session");
      helpCommand("startup", "Says startup message");
      helpCommand("changelog", "Changelog for Seb Terminal");
      helpCommand("credits", "Displays credits");
    break;
    case "all":
      addLine("-------------------------");
      addLine("[cy]Work:[/cy]");
      addLine("-------------------------");
      commandHandler("work",cmdline=false);
      addLine("[n/]");
      addLine("-------------------------");
      addLine("[cy]Skills:[/cy]");
      addLine("-------------------------");
      commandHandler("skills",cmdline=false);
      addLine("[n/]");
      addLine("-------------------------");
      addLine("[cy]Education:[/cy]");
      addLine("-------------------------");
      commandHandler("education",cmdline=false);
      addLine("[n/]");
      addLine("-------------------------");
      addLine("[cy]Contact:[/cy]");
      addLine("-------------------------");
      commandHandler("contact",cmdline=false);
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
    break;
    case "contact":
      addLine("[2s/] Personal Email:");
      addLine("[6s/][clb]<a href='mailto:seblewis96@gmail.com'>seblewis96@gmail.com</a>[/clb]");
      addLine("[n/]");
      addLine("[2s/] LinkedIn:");
      addLine("[6s/][clb][link-https://www.linkedin.com/in/sebastian-lewis-231a48b2/]Sebastian Lewis[/link][/clb]");
      addLine("[n/]");
      addLine("[2s/] Mobile Number:");
      addLine("[6s/][clb]<a href='tel:07807347796'>07807347796</a>[/clb]");
      addLine("[n/]");
      addLine("[2s/] Instagram:");
      addLine("[6s/][clb][link-https://www.instagram.com/sebsaid22/]sebsaid22[/link][/clb]");
      addLine("[n/]");
      addLine("[2s/] GitHub:");
      addLine("[6s/][clb][link-https://github.com/slewis96]slewis96[/link][/clb]");
      addLine("[n/]");
    break;
    case "education":
      addLine("[clb]University Of Birmingham - <b>BSc Computer Science</b>, <i>2014-2017</i>[/clb]");
      addLine("[2s/]<b>Dissertation</b> - Implementation of hidden functionality within a web page");
      addLine("[2s/]<b>Key Modules</b> - Software Engineering, Networks, Software System Components, Computer Security, Databases");
      addLine("[clb]Halesowen College <i>2012-2014</i>[/clb] - BTEC Level 3 IT Course Grade: Distinction*");
      addLine("[clb]Bartley Green Technology College <i>2007-2012</i>[/clb] - 8 GCSEs, 2 BTECS, and an OCR including Maths and English (B-C)");
    break;
    case "monkey":
      addLine(
        "<img src='https://www.placemonkeys.com/250/250?random'></img>"
      );
    break;
    case "easteregg":
      addLine(
        "[cy]Try using:[/cy] [clb][click-monkey]monkey[/click][/clb]"
      );
    break;
    case "skills":
      addLine("[cg]Cloud & Platform[/cg]");
      addLine("[3s/]*Azure[1s/]*AWS[1s/]*GCP");
      addLine("[3s/]*Kubernetes[1s/]*AKS[1s/]*Docker");
      addLine("[3s/]*Terraform[1s/]*Helm[1s/]*Ansible");
      addLine("[3s/]*Istio[1s/]*ARM[1s/]*Crossplane");

      addLine("[cg]SRE & Reliability[/cg]");
      addLine("[3s/]*SLIs/SLOs[1s/]*Error Budgets");
      addLine("[3s/]*Incident Response[1s/]*Postmortems/RCA");
      addLine("[3s/]*Disaster Recovery[1s/]*Capacity Planning");
      addLine("[3s/]*High Availability[1s/]*Toil Reduction");

      addLine("[cg]Observability & Data[/cg]");
      addLine("[3s/]*Grafana[1s/]*Prometheus[1s/]*InfluxDB");
      addLine("[3s/]*Coralogix[1s/]*Sentry[1s/]*AppInsights");
      addLine("[3s/]*Lightstep[1s/]*Distributed Tracing");
      addLine("[3s/]*Kafka[1s/]*Redis[1s/]*Log-to-Metric Pipelines");

      addLine("[cg]CI/CD & Automation[/cg]");
      addLine("[3s/]*Azure DevOps[1s/]*GitHub Actions[1s/]*GitHub");
      addLine("[3s/]*Jenkins[1s/]*Concourse[1s/]*Airflow");
      addLine("[3s/]*Automated Testing[1s/]*Dependency Management");
      addLine("[3s/]*Release Automation[1s/]*AI-assisted Engineering");

      addLine("[cg]Software Engineering[/cg]");
      addLine("[3s/]*Python[1s/]*Node.js[1s/]*JavaScript");
      addLine("[3s/]*React[1s/]*Bash[1s/]*PowerShell");
      addLine("[3s/]*SQL[1s/]*APIs[1s/]*Networking");
      addLine("[3s/]*ETL[1s/]*Celery/RQ");

      addLine("[cg]Leadership & Delivery[/cg]");
      addLine("[3s/]*Platform Strategy[1s/]*Technical Leadership");
      addLine("[3s/]*Stakeholder Management[1s/]*Team Leadership");
      addLine("[3s/]*Mentoring[1s/]*Engineering Standards");
      addLine("[3s/]*Platform Modernisation[1s/]*Cost Optimisation");

      addLine("[cg]AI Tooling[/cg]");
      addLine("[3s/]*Claude[1s/]*GitHub Copilot[1s/]*Speckit");
    break;
    case "work":
      workHelpCommand(
        "LeadSiteReliabilityEngineer",
        "June 2025 - present @ FactSet - London[n/][3s/][cg]Top Skills:[/cg] SRE, Error Budgets, Incident Response"
      );
      workHelpCommand(
        "LeadPlatformEngineer",
        "July 2023 - June 2025 @ Insurwave Ltd - London[n/][3s/][cg]Top Skills:[/cg] Team Leadership, Azure, Terraform"
      );
      workHelpCommand(
        "SeniorDevOpsEngineer",
        "Feb 2023 - July 2023 @ JustEat Takeaway.com - London[n/][3s/][cg]Top Skills:[/cg] GitHub Actions, GCP, Airflow"
      );
      workHelpCommand(
        "PlatformEngineer",
        "Feb 2021 - Jan 2023 @ Insurwave Ltd - London[n/][3s/][cg]Top Skills:[/cg] Azure, AKS, Terraform"
      );
      workHelpCommand(
        "DevOpsEngineer",
        "Aug 2018 - Feb 2021 @ iPSL - Northampton[n/][3s/][cg]Top Skills:[/cg] Azure DevOps, PowerShell, Training"
      );
      workHelpCommand(
        "TechnicalConsultant",
        "May 2018 - July 2020 @ Sparta Global - Northampton[n/][3s/][cg]Top Skills:[/cg] DevOps, SDET, Consulting"
      );
    break;
    case "work leadsitereliabilityengineer":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: LeadSiteReliabilityEngineer");
      addLine("[3s/]company: FactSet");
      addLine("[3s/]startDate: June 2025");
      addLine("[3s/]endDate: null");
      addLine("[3s/]status: currentEmployer");
      addLine("[3s/]location: London");
      addLine("}");
      addLine("[n/]");
      addLine(
        "I currently work as a Lead Site Reliability Engineer / Principal Software Engineer at FactSet, a global financial data and software company. My role sits within Platform Infrastructure Engineering and combines reliability engagements with SRE Core ownership of reliability tooling, incident management systems, error budget platforms, observability pipelines and legacy enterprise failover tooling.[n/][n/]"
      );
      addLine("Key areas of focus include:[n/][n/]");
      addLine("● Helping teams instrument complex systems and adopt SLIs/SLOs, error budgets, postmortems and better alerting");
      addLine("● Supporting a major SRE engagement with a business-critical trading, execution and order management platform");
      addLine("● Creating approximately 20 SLIs/SLOs covering end-to-end client experience");
      addLine("● Improving Error Budgets and SLI tooling covering 1,000+ services and around 10 TB of logs/metrics per day");
      addLine("● Modernising Python, Ubuntu and Redis-backed SRE services with no downtime");
      addLine("● Supporting critical incident response, RCA and postmortem action planning");
      addLine("● Developing capacity-planning tooling using predictive modelling, alerting integrations and Kubernetes/Crossplane migration work");
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
      addLine("[n/][n/]");
    break;
    case "work leadplatformengineer":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: LeadPlatformEngineer");
      addLine("[3s/]company: Insurwave Ltd");
      addLine("[3s/]startDate: July 2023");
      addLine("[3s/]endDate: June 2025");
      addLine("[3s/]status: previousEmployer");
      addLine("[3s/]location: London");
      addLine("}");
      addLine("[n/]");
      addLine(
        "I worked as Lead Platform Engineer at Insurwave, a SaaS platform modernising speciality insurance by connecting insurers, brokers and major shipping clients. My role focused on managing a team of 4 platform engineers, improving team structure and delivery, and leading platform improvements across Terraform, Azure, disaster recovery, observability and deployment automation.[n/][n/]"
      );
      addLine("Key achievements included:[n/][n/]");
      addLine("● Managed and led a team of 4 platform engineers, reintroducing structure, ceremonies and prioritisation");
      addLine("● Defined new Terraform and platform-engineering standards");
      addLine("● Standardised deployment of a new AI platform within 6 weeks");
      addLine("● Reduced infrastructure cost by 70% and new environment deployment time by 90%, from 48 hours to 3 hours");
      addLine("● Reduced disaster recovery time to under 3 hours and enabled on-the-fly environment creation");
      addLine("● Migrated frontend services from Kubernetes to CDN with zero downtime");
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
      addLine("[n/][n/]");
    break;
    case "work seniordevopsengineer":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: SeniorDevOpsEngineer ");
      addLine("[3s/]company: JustEat Takeaway.com ");
      addLine("[3s/]startDate: Feb 2023")
      addLine("[3s/]endDate: July 2023")
      addLine("[3s/]location: London")
      addLine("}");
      addLine("[n/]");
      addLine("I was hired at JustEat in their data platforms department; my primary responsibilities here were guiding multiple" +
      "engineering teams based in multiple countries on integrating and leveraging automation within the data" +
      "platforms space, covering tools/capabilities such as GCP, Terraform, Airflow and GitHub Actions.")
      addLine("● Definition of brand-new CI/CD processes")
      addLine("● Create end-to-end Airflow environments")
      addLine("● Ensuring smooth cross cloud-integrations")
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
      addLine("[n/][n/]");
    break;
    case "work platformengineer":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: PlatformEngineer ");
      addLine("[3s/]company: Insurwave Ltd ");
      addLine("[3s/]startDate: Feb 2021")
      addLine("[3s/]endDate: Jan 2023")
      addLine("[3s/]location: London")
      addLine("}");
      addLine("[n/]");
      addLine("I was hired at Insurwave, a company developing a SaaS platform to modernise speciality insurance by connecting" +
      "all participants. The company counts some of the biggest shipping companies in the world as its clients." +
      "Every activity I undertook at Insurwave was completed in the most automated, secure, and resilient manner. This" +
      "led me to implement and maintain the following:")
      addLine("● All infrastructure and its integrity")
      addLine("● CI/CD strategies via Azure DevOps")
      addLine("● Azure Resources")
      addLine("● Bespoke services to meet client needs")
      addLine("● Monitoring capabilities on all levels")
      addLine("● Network Configuration")
      addLine("● Data Analytics Functionality")
      addLine("● Disaster Recovery Functionality")
      addLine("● Authentication/Authorization Strategies")
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
      addLine("[n/][n/]");
    break;
    case "work devopsengineer":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: DevOpsEngineer ");
      addLine("[3s/]company: iPSL – Intelligent Processing Solutions Ltd");
      addLine("[3s/]startDate: Aug 2018")
      addLine("[3s/]endDate: Feb 2021")
      addLine("[3s/]location: Northampton")
      addLine("}");
      addLine("[n/]");
      addLine("After working for 2 years as a consultant, I was made permanent at iPSL, a company handling cheque processing" +
      "for Lloyds, HSBC, and Barclays. The main project I worked on was the migration from TFS over to Azure DevOps," +
      "where I liaised with stakeholders to gather and then implement requirements, creating solutions for all issues" +
      "presented and became the primary resource for the newly implemented toolset, involving:")
      addLine("● Improving development strategy")
      addLine("● Automation testing integration")
      addLine("● Ensuring a smoother, more regulated release strategy")
      addLine("● Ensuring the adoption of new software/methodologies")
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
      addLine("[n/][n/]");
    break;
    case "work technicalconsultant":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: TechnicalConsultant ");
      addLine("[3s/]company: Sparta Global ");
      addLine("[3s/]startDate: May 2018")
      addLine("[3s/]endDate: July 2020")
      addLine("[3s/]location: Northampton")
      addLine("}");
      addLine("[n/]");
      addLine("After University, I was hired by Sparta Global, where I:")
      addLine("● Established myself as an SME in helping the client adopt DevOps tools/methodologies")
      addLine("● Recognised as Sparta Global’s employee of the month, August 2019")
      addLine("[n/]");
      addLine(
        "[cy]For more details:[/cy] Use the [clb][click-cv]cv[/click][/clb] command to open my cv with further info"
      );
      addLine("[n/][n/]");
    break;
    case "work computervolunteer":
      addLine("[n/]");
      addLine("{");
      addLine("[3s/]roleId: ComputerVolunteer ");
      addLine("[3s/]company: Northfield Community Partnership ");
      addLine("[3s/]startDate: Feb 2018")
      addLine("[3s/]endDate: May 2018")
      addLine("[3s/]location: Birmingham")
      addLine("}");
      addLine("[n/]");
      addLine("While I was here, I taught digital skills to vulnerable people who weren’t confident with computers and helped with the food bank.")
      addLine("[n/][n/]");
    break;
    case "credits":
      addLine(
        "[n/][clb]GitHub Repo: [link-https://github.com/slewis96/terminalweb]slewis96/terminalweb[/link][/clb][n/][n/]"
      );
      addLine("Huge Thanks to: ");
      addLine(
        "[n/][clb]Forked GitHub Repo: [link-https://github.com/woooferz/terminalweb]woooferz/terminalweb[/link][/clb]"
      );
      addLine(
        "Having found wooferz repo it was the perfect level of web dev skills for me &#128517;[n/][n/]"
      );
      addLine(
        "[n/]Also if you'd like to visit my old website (circa 2018), when I thought it'd be good try from scratch &#128517;, see here - "
      );
      addLine(
        "[clb][link-https://old.sebastianlewis.io/]old.sebastianlewis.io[/link][/clb][n/][n/]"
      );
      break;
    case "changelog":
      addLine("Changelog:");
      addLine("[2s/]v1.2.1:");
      addLine("[4s/]1 character spelling fix - HUGE CHANGE");
      addLine("[n/]");
      addLine("[2s/]v1.2.0:");
      addLine("[4s/]Various formatting changes to support mobile and desktop");
      addLine("[n/]");
      addLine("[2s/]v1.1.3:");
      addLine("[4s/]URL fixes");
      addLine("[n/]");
      addLine("[2s/]v1.1.2:");
      addLine("[4s/]Fixed formatting and icon");
      addLine("[n/]");
      addLine("[2s/]v1.1.0:");
      addLine("[4s/]Finalised content updates");
      addLine("[n/]");
      addLine("[2s/]v1.0.0:");
      addLine("[4s/]Launched website online &#128640;");
      addLine("[n/]");
      addLine("[2s/]v0.1.0:");
      addLine("[4s/]Added initial commands with details");
      addLine("[n/]");
      addLine("[2s/]v0.0.1:");
      addLine("[4s/]Initial Setup");
      break;
    case "history":
      addLine("[cy]History:[/cy]");
      addLine(commands.join("[n/]"));
      break;
    case "startup":
      addLine("-------------------------");
      addLine("Welcome to Seb Lewis Terminal " + version + "!");
      addLine(
        "[cy]TIPS:[/cy] Use the [clb][click-help]help[/click][/clb] command to recieve help!"
      );
      break;
    case "clear":
    case "c":
      clearOutput();
      break;
    case "":
      break;
    default:
      if (!advancedCommands(command))
        addLine(
          "[cr]Unknown Command! Use [click-help]help[/click] for help![/cr]"
        );
      break;
  }
  window.scrollTo(0, document.body.scrollHeight);
}

input.onkeydown = function (e) {
  if (e.key == "Enter") {
    let preppedCommand = input.value.toLowerCase();
    commandHandler(preppedCommand);
    if (input.value != "") {
      commands.push(input.value);
    }
    setInput("");
    refocus();
  } else if (e.key == "ArrowUp") {
    backIndex = backIndex >= commands.length ? backIndex : backIndex + 1;
    setInput(backIndex <= 0 ? "" : commands[commands.length - backIndex]);
    refocus();
  } else if (e.key == "ArrowDown") {
    backIndex = backIndex <= 0 ? 0 : backIndex - 1;

    setInput(backIndex <= 0 ? "" : commands[commands.length - backIndex]);
    refocus();
  } else if (e.key == "Tab") {
    preppedInput=input.value.toLowerCase();
    let preppedAvailableCommands = availableCommands.map(v => v.toLowerCase());
    if (input.value != "") {
      for (var i = 0; i < availableCommands.length; i++) {
        if (
          preppedAvailableCommands[i].startsWith(preppedInput) &&
          preppedAvailableCommands[i] != preppedInput
        ) {
          // console.log(availableCommands[i]);
          setInput(availableCommands[i]);
          break;
        }
      }
    }
    e.preventDefault();
  }
};

commandHandler("startup", false);

const woofclicks = document.querySelectorAll(".click");
woofclicks.forEach((woofclick) => {
  woofclick.onclick = function (event) {
    setInput(this.getAttribute("woofclick"));
  };
});
document.addEventListener("DOMSubtreeModified", (e) => {
  const woofclicks = document.querySelectorAll(".click");
  woofclicks.forEach((woofclick) => {
    woofclick.onclick = function (event) {
      setInput(this.getAttribute("woofclick"));
    };
  });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
lengthOfPrefix = stextLength(prefixText);
marginPrefix = lengthOfPrefix * CHAR_SIZE + TEXT_OFFSET;
autocomplete.style.cssText += "margin-left:" + marginPrefix + "px;";
