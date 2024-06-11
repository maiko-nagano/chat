// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

/**
 * Config = 機密情報です！！！それぞれ違う値
 * この部分はGitHubに上げないこと！！！！！！！
 */
//


// Initialize Firebase リアルタイムデータベースに接続
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
// chatという階層にデータを格納
const dbRef = ref(database, "chat");

//オブジェクトの練習
// const kosuge = {
//   name:'こすげ',
//   age:41,
//   from:'神奈川',
// } ;
// console.log(kosuge.name);
// console.log(kosuge['from']);


// 送信ボタンを押したときの処理
$('#send').on('click',function() {
  
  // 入力欄のデータを取得
  const userName = $('#userName').val();
  const text = $('#text').val();
  // 現在の日時を取得
  const timestamp = new Date();
  // 日時を適切なフォーマットに整形
  const formattedDate = timestamp.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
// コンソールで流れを確認 どのなみかっこの中にあるかチェック！
  console.log('ちゃんとフォームから値取得できたか', userName, text, timestamp);

  // 送信データをオブジェクトにまとめる
  const message = {
    userName: userName,
    text: text,
    timestamp: formattedDate
  };

  // firebase realtime databaseにオブジェクト送信
  // ユニークキーを生成してデータが入る
  const newPostRef = push(dbRef);
  set(newPostRef, message);

 // 入力欄をクリア
 $('#text').val('');

});

// enterキー押しても追加
$('#text').on('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // デフォルトのEnterキーの挙動を無効化
    $('#send').click(); // 送信ボタンをクリック
  }
});

// 指定した場所にデータが追加されたことを検知
onChildAdded(dbRef, function(data) {
  // 追加されたデータをFirebaseから受け取り、分解
// ルールに則った分解方法　コンソールで中身確認を徹底
  const message = data.val();
  const key = data.key;

  let chatMsg = `
   <div class="chat ${message.userName !== 'ながの' ? 'right' : 'left'}"> 
   <div class="message">
   <div>${message.userName}</div> 
   <div>${message.text}</div> 
   <div>${message.timestamp}</div> 
    </div>
   <button class="delete" data-key="${key}">削除
 </button>
   </div>
    `;

    $('#output').append(chatMsg);

  });

 

  $(document).on('click', '.delete', function() {
    const key = $(this).data('key'); // ボタンに設定したdata属性からキーを取得
    console.log('Delete button clicked with key:', key);
  
    // データベースからエントリを削除
    remove(ref(database, `chat/${key}`));
    // 対応するHTML要素も削除
    $(this).closest('.chat').remove();
  });