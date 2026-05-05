import { computed, reactive } from "vue";

type ProtocolStatus =
  | "new"
  | "searching"
  | "enriched"
  | "reviewed"
  | "strategy_selected"
  | "next_steps_ready";

type SearchStatus = "idle" | "typing" | "searching" | "found" | "fallback";

export interface CompanySummary {
  name: string;
  inn: string;
  holdingCompanies: string;
  revenue: string;
  founded: string;
  employees: string;
}

interface ProjectDetail {
  title: string;
  lines: string[];
}

export interface KeyFigure {
  id: string;
  name: string[];
  role: string;
  inn: string;
  period: string;
  note: string;
  tone: "success" | "warning" | "danger";
  marker: "ЛПР" | "ЛВР" | "кандидат";
  reviewStatus: "требует проверки" | "подтверждено" | "отклонено";
  confidence: number;
  source: string;
}

export type FigureMarker = KeyFigure["marker"];

export interface RelationshipPath {
  id: string;
  title: string;
  path: string[];
  risk: "низкий" | "средний" | "высокий";
  confidence: number;
  source: string;
  action: string;
}

export interface EntryStrategy {
  id: string;
  title: string;
  description: string;
  risk: "низкий" | "средний" | "высокий";
  pathId: string;
  selected: boolean;
  nextSteps: NextStep[];
}

export interface NextStep {
  number: string;
  status: string;
  text: string;
}

interface SearchHistoryItem {
  id: number;
  companyName: string;
  companyInn: string;
  createdAt: string;
  author: string;
}

const demoProject = {
  title: "Строительство цеха сварки",
  subtitle: "Производственный корпус · Шушары, Санкт-Петербург",
  preparedBy: "Company Name",
  preparedAt: "апрель 2026",
  company: {
    name: "Company Name",
    inn: "123456789012",
    holdingCompanies: "14",
    revenue: "31 млрд",
    founded: "1999",
    employees: "~5 000",
  },
  details: [
    {
      title: "Локация",
      lines: ["Шушары, Санкт-Петербург", "ул. Автозаводская, 2"],
    },
    {
      title: "Объект",
      lines: ["Company Name"],
    },
    {
      title: "Инвестор",
      lines: ["Company Name", "Иван Иванович"],
    },
    {
      title: "Заказчик",
      lines: ["Company Name", "Петр Петрович"],
    },
  ] satisfies ProjectDetail[],
  description: [
    "Строительство производственного корпуса (цех сварки) на территории завода Company Name в Шушарах, Санкт-Петербург.",
    "Тендер разбит на 2 лота: Лот 1 — Земляные работы, сваи, ростверки; Лот 2 — Возведение здания (до технологии).",
    "Завод Company Name — бывшая производственная площадка (Шушары). Ныне площадка для производства автомобилей Company Name.",
  ],
};

export const searchFlowSteps = [
  "Проверяем ИНН",
  "Ищем компанию в реестрах",
  "Сопоставляем с проектной памятью",
  "Формируем протокол",
] as const;

let searchRunId = 0;

export const demoProtocol = reactive({
  status: "enriched" as ProtocolStatus,
  search: {
    input: "",
    status: "idle" as SearchStatus,
    activeStep: -1,
    lastNote: "Введите ИНН или любой запрос для запуска демо",
    resultTitle: "",
    resultDescription: "",
    resultStats: [] as string[],
  },
  activeProject: demoProject,
  searchHistory: [
    {
      id: 1,
      companyName: "Company Name",
      companyInn: "123456789012",
      createdAt: "12.01.2026 10:24",
      author: "Иван Иванович",
    },
    {
      id: 2,
      companyName: "Company Name",
      companyInn: "123456789012",
      createdAt: "18.01.2026 15:42",
      author: "Петр Петрович",
    },
    {
      id: 3,
      companyName: "Company Name",
      companyInn: "123456789012",
      createdAt: "27.01.2026 09:18",
      author: "Сергей Сергеевич",
    },
  ] satisfies SearchHistoryItem[],
  keyFigures: [
    {
      id: "ivan",
      name: ["Иван", "Иванович"],
      role: "Гендир. Company Name",
      inn: "ИНН: 123456789012",
      period: "с 20.11.2023",
      note: "Массовый директор (5+ компаний, признак ФНС)",
      tone: "warning",
      marker: "кандидат",
      reviewStatus: "требует проверки",
      confidence: 72,
      source: "ЕГРЮЛ",
    },
    {
      id: "petr",
      name: ["Петр", "Петрович"],
      role: "Генеральный директор Company Name",
      inn: "ИНН: 123456789012",
      period: "с 07.02.2023",
      note: "Опытный менеджер Ford Russia 2000–2016",
      tone: "success",
      marker: "ЛПР",
      reviewStatus: "требует проверки",
      confidence: 86,
      source: "отчет менеджера",
    },
    {
      id: "sergey",
      name: ["Сергей", "Сергеевич"],
      role: "Гендир. Company Name",
      inn: "ИНН: 123456789012",
      period: "2024–2025",
      note: "Массовый директор (5+ компаний)",
      tone: "warning",
      marker: "ЛВР",
      reviewStatus: "подтверждено",
      confidence: 79,
      source: "ручной ввод",
    },
    {
      id: "alexey",
      name: ["Алексей", "Алексеевич"],
      role: "Гендиректор Company Name",
      inn: "ИНН: 123456789012",
      period: "с 13.03.2022",
      note: "Данные учредителей скрыты по ФЗ-129",
      tone: "danger",
      marker: "кандидат",
      reviewStatus: "требует проверки",
      confidence: 64,
      source: "ГЛОБАС",
    },
  ] as KeyFigure[],
  relationshipPaths: [
    {
      id: "recommended",
      title: "Рекомендуемый путь",
      path: ["Наша команда", "Сергей Сергеевич", "Петр Петрович"],
      risk: "низкий",
      confidence: 82,
      source: "ручной ввод + отчет",
      action: "Запросить интро через Сергея Сергеевича",
    },
    {
      id: "alternative",
      title: "Альтернативный путь",
      path: ["Наша команда", "Алексей Алексеевич", "Петр Петрович"],
      risk: "средний",
      confidence: 68,
      source: "открытые источники",
      action: "Проверить актуальность контакта перед встречей",
    },
  ] satisfies RelationshipPath[],
  entryStrategies: [
    {
      id: "strategy-director",
      title: "Встреча через подтвержденного ЛВР",
      description:
        "Использовать подтвержденную связь с Сергеем Сергеевичем и выйти на Петра Петровича как ЛПР.",
      risk: "низкий",
      pathId: "recommended",
      selected: false,
      nextSteps: [
        {
          number: "01",
          status: "Активно",
          text: "Зафиксировать участие в тендере на земляные работы",
        },
        {
          number: "02",
          status: "Требуется",
          text: "Запросить интро через Сергея Сергеевича",
        },
        {
          number: "03",
          status: "Встреча",
          text: "Провести встречу с Петровичем как ЛПР",
        },
        {
          number: "04",
          status: "Контроль",
          text: "Закрепить условия входа: гарантия, предоплата, риск",
        },
      ],
    },
    {
      id: "strategy-procurement",
      title: "Заход через закупки",
      description:
        "Начать с отдела закупок и параллельно проверить управленческий контур заказчика.",
      risk: "средний",
      pathId: "alternative",
      selected: false,
      nextSteps: [
        {
          number: "01",
          status: "Активно",
          text: "Зафиксировать участие в тендере",
        },
        {
          number: "02",
          status: "Сбор",
          text: "Собрать актуальные контакты закупок",
        },
        {
          number: "03",
          status: "Проверка",
          text: "Проверить управленческий контур заказчика",
        },
        {
          number: "04",
          status: "Параллельно",
          text: "Выйти на ЛПР через альтернативную цепочку",
        },
        {
          number: "05",
          status: "Обновить",
          text: "Обновить протокол после первичного контакта",
        },
      ],
    },
  ] as EntryStrategy[],
});

function formatSearchDate() {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function runDemoSearch(input: string) {
  const normalizedInput = input.trim();

  if (!normalizedInput) {
    demoProtocol.search.status = "idle";
    demoProtocol.search.lastNote = "Введите ИНН для запуска демо-протокола";
    demoProtocol.search.resultTitle = "";
    demoProtocol.search.resultDescription = "";
    demoProtocol.search.resultStats = [];
    return;
  }

  const currentRunId = Date.now();
  searchRunId = currentRunId;

  demoProtocol.search.input = normalizedInput;
  demoProtocol.search.status = "searching";
  demoProtocol.search.activeStep = 0;
  demoProtocol.search.lastNote = "Запущен протокол поиска";
  demoProtocol.search.resultTitle = "";
  demoProtocol.search.resultDescription = "";
  demoProtocol.search.resultStats = [];
  demoProtocol.status = "searching";

  for (let stepIndex = 0; stepIndex < searchFlowSteps.length; stepIndex += 1) {
    if (searchRunId !== currentRunId) {
      return;
    }

    demoProtocol.search.activeStep = stepIndex;
    await wait(760);
  }

  if (searchRunId !== currentRunId) {
    return;
  }

  const isPreparedInn =
    normalizedInput === demoProtocol.activeProject.company.inn;

  demoProtocol.status = "enriched";
  demoProtocol.search.status = isPreparedInn ? "found" : "fallback";
  demoProtocol.search.lastNote = isPreparedInn
    ? "Компания найдена в подготовленных данных"
    : "Для прототипа открыт подготовленный проект с демо-данными";
  demoProtocol.search.resultTitle = demoProtocol.activeProject.title;
  demoProtocol.search.resultDescription = isPreparedInn
    ? `${demoProtocol.activeProject.company.name} найдена по ИНН ${normalizedInput}`
    : `Запрос "${normalizedInput}" привязан к подготовленному демо-проекту`;
  demoProtocol.search.resultStats = [
    `${demoProtocol.keyFigures.length} ключевые фигуры`,
    "2 кандидата ЛПР/ЛВР",
    `${demoProtocol.relationshipPaths.length} цепочки входа`,
  ];
  demoProtocol.searchHistory.unshift({
    id: Date.now(),
    companyName: demoProtocol.activeProject.company.name,
    companyInn: normalizedInput,
    createdAt: formatSearchDate(),
    author: "Администратор",
  });
}

export function deleteSearchHistoryItem(id: number) {
  const itemIndex = demoProtocol.searchHistory.findIndex(
    (item) => item.id === id,
  );

  if (itemIndex >= 0) {
    demoProtocol.searchHistory.splice(itemIndex, 1);
  }
}

export const selectedStrategy = computed(() =>
  demoProtocol.entryStrategies.find((strategy) => strategy.selected),
);

export const nextSteps = computed<NextStep[]>(() => {
  const strategy = selectedStrategy.value;

  return (
    strategy?.nextSteps ?? [
      {
        number: "01",
        status: "Черновик",
        text: "Выбрать стратегию входа после проверки ЛПР/ЛВР",
      },
    ]
  );
});

export function selectStrategy(strategyId: string) {
  demoProtocol.entryStrategies.forEach((strategy) => {
    strategy.selected = strategy.id === strategyId;
  });
  demoProtocol.status = "strategy_selected";
}

export function setFigureReviewStatus(
  figureId: string,
  reviewStatus: KeyFigure["reviewStatus"],
) {
  const figure = demoProtocol.keyFigures.find((item) => item.id === figureId);

  if (figure) {
    figure.reviewStatus = reviewStatus;
    demoProtocol.status = "reviewed";
  }
}

export const figureReviewSummary = computed(() => {
  const pending = demoProtocol.keyFigures.filter(
    (figure) => figure.reviewStatus === "требует проверки",
  ).length;
  const confirmed = demoProtocol.keyFigures.filter(
    (figure) => figure.reviewStatus === "подтверждено",
  ).length;
  const unconfirmedDecisionMakers = demoProtocol.keyFigures.filter(
    (figure) =>
      (figure.marker === "ЛПР" || figure.marker === "ЛВР") &&
      figure.reviewStatus !== "подтверждено",
  ).length;

  return {
    total: demoProtocol.keyFigures.length,
    pending,
    confirmed,
    unconfirmedDecisionMakers,
  };
});

export function setFigureMarker(figureId: string, marker: FigureMarker) {
  const figure = demoProtocol.keyFigures.find((item) => item.id === figureId);

  if (figure) {
    figure.marker = marker;
    figure.reviewStatus = "требует проверки";
    demoProtocol.status = "reviewed";
  }
}
