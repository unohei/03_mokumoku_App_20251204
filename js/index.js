let startTime = null;

// ログの取得
function getLogs() {
  return JSON.parse(localStorage.getItem("studyLogs") || "[]");
}

// ローカルストレージに保存
function saveLog(log) {
  const logs = getLogs();
  logs.push(log);
  localStorage.setItem("studyLogs", JSON.stringify(logs));
  console.log(log);
}

// スタート
$("#startBtn").on("click", function () {
  startTime = Date.now();
  $("#status").text("もくもく中…もくもく");
  $("#endBtn").prop("disabled", false);
});

// エンド
$("#endBtn").on("click", function () {
  if (!startTime) return;

  const end = Date.now();
  const diffMin = Math.floor((end - startTime) / 1000 / 60);

  const task = $("#task").val();
  const dateStr = new Date().toISOString().split("T")[0];

  saveLog({
    date: dateStr,
    task: task,
    minutes: diffMin,
  });

  $("#status").text(`もくもく保存 (${diffMin}分)`);
  startTime = null;
  $("#endBtn").prop("disabled", true);
});
