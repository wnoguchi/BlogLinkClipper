
/**
  * ポップアップJavaScript
  * @author Wataru Noguchi <wnoguchi.0727@gmail.com>
  */

var c = chrome;
var ws = c.windows;
var tbs = c.tabs;

$(function() {
  manageSelection($('#simpleFormat'));
  setTextAreaUrlAndTitle();
  
  // 設定が変更されたらテキストエリアの内容を変更するイベント
  $('.formatChanger').click(function () {
    manageSelection(this);
    setTextAreaUrlAndTitle();
  });
  
  /** コピーボタンが押されたときのアクションをバインド */
  $('#copyButton').click(function () {
    $('#text').focus();
    $('#text').select();
    document.execCommand("Copy");
    
    $('#notice').html('Text was successfully copied!');
    setTimeout(function () {
      $('#notice').html('');
    }, 5000);
  });
});

/** 現在選択されているタブのURLとタイトルを取得してテキストエリアに設定する */
function setTextAreaUrlAndTitle() {
  
  try {
    ws.getCurrent(function (window) {
      /** 選択されているタブをハンドリングする処理 */
      tbs.getSelected(window.id, function (tab) {
        var url = tab.url;
        var title = tab.title;
        var formattedLinkText = '';
        
        // フォーマット判別
        selectedFormat = $('input[type=radio][name=format]:checked').val();
        switch (selectedFormat) {
          // シンプル
          case 'simple':
            formattedLinkText = title + "\n" + url;
            break;
          // リンクタグ
          case 'blog':
            var targetBlankStr = '';
            
            var targetBlank = $('#targetBlankCheckBox').is(':checked');
            if (targetBlank) {
              targetBlankStr = ' target="_blank"';
            }
            
            formattedLinkText = '<a href="' + url + '"' + targetBlankStr + '>' + title +'</a>';
            break;
          // はてな記法
          case 'hatena':
            formattedLinkText = '[' + url + ':title]';
            break;
          // MediaWiki
          case 'media':
            formattedLinkText = '[' + url + ' ' + title + ']';
            break;
          // PukiWiki
          case 'puki':
            formattedLinkText = '[[' + title + ':' + url + ']]';
            break;
          // Redmine
          case 'redmine':
            formattedLinkText = '"' + title + '":' + url;
            break;
        }
        
        // テキスト設定
        $('#text').attr('value', formattedLinkText + "\n");
      });
    });
  } catch (e) {
    alert(e);
  }
}

/** 各コントロールの選択状態をマネージする関数 */
function manageSelection(selectedObject) {
  selectedItemId = $(selectedObject).attr('id');
  if (selectedItemId != 'blogFormat' && selectedItemId != 'targetBlankCheckBox') {
    $('#targetBlankCheckBox').attr('disabled', true);
  } else {
    $('#targetBlankCheckBox').attr('disabled', false);
  }
}

