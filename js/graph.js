// ローカルタイム取得
function formatDateLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ログ取得
function getLogs() {
  const logs = JSON.parse(localStorage.getItem("studyLogs") || "[]");
  console.log("ログ読み込み:", logs);
  return logs;
}

// タスクの色
const taskColors = {
  DEV: "#e15759",
  P2P: "#f28e2b",
  ENGINEER: "#4e79a7",
  OTHER: "#76b7b2",
};

// タスク毎の集計
function aggregateWeekly(logs) {
  console.log("入力ログ:", logs);

  const result = {};

  logs.forEach((log, i) => {
    if (!result[log.date]) result[log.date] = {};
    if (!result[log.date][log.task]) result[log.date][log.task] = 0;

    result[log.date][log.task] += log.minutes;
  });

  console.log("出力 result:", result);
  return result;
}

// 1週間分のデータの表示
function getWeeklyChartData() {
  const logs = getLogs();
  const agg = aggregateWeekly(logs);

  const dates = [];
  const tasks = new Set();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const dateKey = formatDateLocal(d); // ← ローカルタイムに変更
    dates.push(dateKey);

    console.log(`  対象日: ${dateKey}`);

    if (agg[dateKey]) {
      Object.keys(agg[dateKey]).forEach((task) => {
        tasks.add(task);
        console.log(`    task検出 → ${task}`);
      });
    }
  }

  const datasets = [...tasks].map((task) => {
    const dataInHours = dates.map((date) => {
      const minutes = agg[date]?.[task] || 0;
      const hours = minutes / 60;
      return hours;
    });

    const ds = {
      label: task,
      data: dataInHours,
      backgroundColor: taskColors[task],
      stack: "study",
    };

    console.log("[dataset]", ds);

    return ds;
  });

  return { dates, datasets };
}

$(function () {
  const chartData = getWeeklyChartData();
  console.log("最終データ:", chartData);

  new Chart($("#chart"), {
    type: "bar",
    data: {
      labels: chartData.dates,
      datasets: chartData.datasets,
    },
    options: {
      responsive: true,
      scales: {
        x: { stacked: true },
        y: {
          stacked: true,
          beginAtZero: true,
          title: {
            display: true,
            text: "時間（h）",
          },
          ticks: {
            stepSize: 1,
            callback: function (value) {
              return value + " h";
            },
          },
          suggestedMax: 6,
        },
      },
    },
  });
});
