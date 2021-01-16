module.exports.exampleLogs = [
  {
    userName: "Peter",
    cardName: "おかげで",
    original: "ビルのおかげで、日本の生活はそんなに難しくなかった。",
    success: "good",
    date: Date.now(),
    comment: [
      {
        userName: "Bill",
        comment: "😊",
        date: Date.now(),
      },
    ],
  },
  {
    userName: "Bill",
    cardName: "だらけ",
    original: "ビルのオリジナルの文はいつも間違うだらけです。",
    success: "avg",
    date: Date.now(),
    comment: [
      {
        userName: "Peter",
        comment: "「間違うだらけ」is wrong。\ncorrect:「間違いだらけ」",
        date: Date.now(),
      },
      {
        userName: "Bill",
        comment: "Thanks, ピーター先生！",
        date: Date.now(),
      },
    ],
  },
];
