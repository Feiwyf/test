let selectedOption = null; // 儲存選擇的選項
let resultMessage = ""; // 儲存結果訊息
let questionData = {}; // 儲存題目與選項資料
let currentQuestionIndex = 0; // 當前題目索引
let correctCount = 0; // 答對題數
let incorrectCount = 0; // 答錯題數
let isQuizFinished = false; // 測驗是否完成
let inputBox; // 用於填空題的文字框
let userAnswer = ""; // 使用者輸入的答案

function preload() {
  // 載入 CSV 檔案
  questionData = loadTable("questions.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight); // 全視窗大小
  inputBox = createInput(); // 建立文字框
  inputBox.size(200); // 設定文字框大小
  inputBox.hide(); // 預設隱藏文字框
}

function draw() {
  background(255, 239, 184); // 鵝黃色背景
  fill(255, 182, 193); // 設定矩形顏色為淡粉色
  noStroke(); // 移除邊框
  rect(windowWidth / 4, windowHeight / 4, windowWidth / 2, windowHeight / 2); // 繪製矩形

  if (!isQuizFinished) {
    const questionType = questionData.getString(currentQuestionIndex, "type"); // 題目類型
    const question = questionData.getString(currentQuestionIndex, "question");

    // 顯示問題文字
    fill(0); // 黑色文字
    textSize(35);
    textAlign(CENTER, CENTER);
    text(question, windowWidth / 2, windowHeight / 3); // 問題文字位置調整

    if (questionType === "choice") {
      // 顯示選項按鈕
      const options = [
        questionData.getString(currentQuestionIndex, "option1"),
        questionData.getString(currentQuestionIndex, "option2"),
        questionData.getString(currentQuestionIndex, "option3"),
        questionData.getString(currentQuestionIndex, "option4"),
      ];
      const buttonWidth = 150; // 增加按鈕寬度
      const buttonHeight = 60; // 增加按鈕高度
      const spacing = 30;
      const startX = windowWidth / 2 - (options.length * (buttonWidth + spacing) - spacing) / 2;
      const startY = windowHeight / 2;

      for (let i = 0; i < options.length; i++) {
        const x = startX + i * (buttonWidth + spacing);
        const y = startY;

        if (selectedOption === i) {
          fill(173, 216, 230); // 淡藍色背景表示選中
        } else {
          fill(255); // 白色背景
        }
        stroke(0); // 黑色邊框
        rect(x, y, buttonWidth, buttonHeight, 10); // 圓角矩形

        fill(0); // 黑色文字
        noStroke();
        textSize(25); // 調整文字大小
        text(options[i], x + buttonWidth / 2, y + buttonHeight / 2);
      }

      // 顯示下一題按鈕
      const submitX = windowWidth / 2 - buttonWidth / 2;
      const submitY = startY + buttonHeight + 70; // 調整按鈕位置
      fill(100, 200, 100); // 綠色背景
      stroke(0);
      rect(submitX, submitY, buttonWidth, buttonHeight, 10);

      fill(255); // 白色文字
      noStroke();
      text("下一題", submitX + buttonWidth / 2, submitY + buttonHeight / 2);

      inputBox.hide(); // 隱藏文字框
    } else if (questionType === "fill") {
      // 填空題顯示文字框
      inputBox.show();
      inputBox.position(windowWidth / 2 - 100, windowHeight / 2 - 25); // 調整文字框位置
      userAnswer = inputBox.value(); // 獲取使用者輸入的答案

      // 顯示送出按鈕
      const submitX = windowWidth / 2 - 150 / 2; // 調整按鈕寬度
      const submitY = windowHeight / 2 + 70; // 調整按鈕位置
      fill(100, 200, 100); // 綠色背景
      stroke(0);
      rect(submitX, submitY, 150, 60, 10); // 調整按鈕大小

      fill(255); // 白色文字
      noStroke();
      textSize(25); // 調整文字大小
      text("送出", submitX + 75, submitY + 30);
    }

    // 顯示結果訊息
    if (resultMessage) {
      fill(0); // 黑色文字
      textSize(25);
      text(resultMessage, windowWidth / 2, windowHeight / 2 + 150); // 調整訊息位置
    }
  } else {
    // 顯示測驗結果
    fill(0); // 黑色文字
    textSize(35);
    textAlign(CENTER, CENTER);
    text(`測驗完成！`, windowWidth / 2, windowHeight / 3);
    text(`答對題數: ${correctCount}`, windowWidth / 2, windowHeight / 3 + 50);
    text(`答錯題數: ${incorrectCount}`, windowWidth / 2, windowHeight / 3 + 100);

    // 顯示再試一次按鈕
    const retryX = windowWidth / 2 - 150 / 2; // 調整按鈕寬度
    const retryY = windowHeight / 2;
    fill(100, 200, 100); // 綠色背景
    stroke(0);
    rect(retryX, retryY, 150, 60, 10); // 調整按鈕大小

    fill(255); // 白色文字
    noStroke();
    textSize(25); // 調整文字大小
    text("再試一次", retryX + 75, retryY + 30);

    inputBox.hide(); // 隱藏文字框
  }
}

function mousePressed() {
  if (!isQuizFinished) {
    const questionType = questionData.getString(currentQuestionIndex, "type");

    if (questionType === "choice") {
      // 檢查是否點擊選項按鈕
      const options = [
        questionData.getString(currentQuestionIndex, "option1"),
        questionData.getString(currentQuestionIndex, "option2"),
        questionData.getString(currentQuestionIndex, "option3"),
        questionData.getString(currentQuestionIndex, "option4"),
      ];
      const buttonWidth = 150; // 修正按鈕寬度
      const buttonHeight = 60; // 修正按鈕高度
      const spacing = 30;
      const startX = windowWidth / 2 - (options.length * (buttonWidth + spacing) - spacing) / 2;
      const startY = windowHeight / 2;

      for (let i = 0; i < options.length; i++) {
        const x = startX + i * (buttonWidth + spacing);
        const y = startY;

        if (
          mouseX > x &&
          mouseX < x + buttonWidth &&
          mouseY > y &&
          mouseY < y + buttonHeight
        ) {
          selectedOption = i; // 設定選中的選項
          resultMessage = ""; // 清除結果訊息
        }
      }

      // 檢查是否點擊下一題按鈕
      const submitX = windowWidth / 2 - buttonWidth / 2;
      const submitY = startY + buttonHeight + 70;

      if (
        mouseX > submitX &&
        mouseX < submitX + buttonWidth &&
        mouseY > submitY &&
        mouseY < submitY + buttonHeight
      ) {
        const correctAnswer = questionData.getString(currentQuestionIndex, "answer");
        if (selectedOption !== null && options[selectedOption] === correctAnswer) {
          correctCount++;
        } else {
          incorrectCount++;
        }

        selectedOption = null; // 重置選項
        currentQuestionIndex++; // 下一題

        if (currentQuestionIndex >= questionData.getRowCount()) {
          isQuizFinished = true; // 測驗完成
        }
      }
    } else if (questionType === "fill") {
      // 檢查是否點擊送出按鈕
      const submitX = windowWidth / 2 - 150 / 2;
      const submitY = windowHeight / 2 + 70;

      if (
        mouseX > submitX &&
        mouseX < submitX + 150 &&
        mouseY > submitY &&
        mouseY < submitY + 60
      ) {
        const correctAnswer = questionData.getString(currentQuestionIndex, "answer");
        if (userAnswer.trim() === correctAnswer) {
          correctCount++;
          resultMessage = "答對了！";
        } else {
          incorrectCount++;
          resultMessage = "答錯了！";
        }

        inputBox.value(""); // 清空文字框
        currentQuestionIndex++; // 下一題

        if (currentQuestionIndex >= questionData.getRowCount()) {
          isQuizFinished = true; // 測驗完成
        }
      }
    }
  } else {
    // 檢查是否點擊再試一次按鈕
    const retryX = windowWidth / 2 - 150 / 2;
    const retryY = windowHeight / 2;

    if (
      mouseX > retryX &&
      mouseX < retryX + 150 &&
      mouseY > retryY &&
      mouseY < retryY + 60
    ) {
      // 重置測驗
      currentQuestionIndex = 0;
      correctCount = 0;
      incorrectCount = 0;
      isQuizFinished = false;
      resultMessage = "";
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 - 25); // 調整文字框位置
}
