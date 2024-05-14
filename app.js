const appVersion = '0.0.1';

function reload() {
  if (!('serviceWorker' in navigator))
    return;

  navigator.serviceWorker.getRegistration()
  .then(registration => {
    if (registration.waiting != null) {
      // registration.unregister();  // 効果が疑わしいので保留
      alert('インストール済みの更新があります。アプリを再起動してください。');
      disableUpdateButton();
      registration.update();
    }
    else {
      registration.update()
      .then(registration => {
        const installingWorker = registration.installing;
        if (installingWorker != null) {
          installingWorker.onstatechange = e => {
            if (e.target.state == 'installed') {
              // registration.unregister();  // 効果が疑わしいので保留
              alert('更新がインストールされました。アプリを再起動してください。');
              disableUpdateButton();
              registration.update();
            }
          }
        }
        else {
          alert('更新はありませんでした。');
        }
      });
    }
  });
}

function disableUpdateButton() {
  // 更新チェック用のボタンを無効化する。
  // ボタンの近くに「再起動してください。」などと表示すると良い。
}

const ipGet1 = () => {
  document.getElementById('your_id').innerText = "";
  fetch('https://api.ipify.org?format=json')
  .then(response => {
    if (!response.ok) {
      throw new Error('ネットワークの状態が良くないか、サーバーに接続できませんでした。');
    }
    return response.json();
  })
  .then(data => {
    document.getElementById('your_id').innerText += data.ip;
  })
  .catch(error => {
    document.getElementById('your_id').innerText = 'IPアドレスを取得できませんでした。';
    console.error('Error fetching IP:', error);
  });
}

const ipGet2 = () => {
  document.getElementById('your_id').innerText = "";
  // window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  var pc = new RTCPeerConnection({iceServers:[]}), noop = function(){};
  var myIP;

  pc.createDataChannel('');

  pc.createOffer(pc.setLocalDescription.bind(pc), noop);

  pc.onicecandidate = function(ice) {
  if (ice && ice.candidate && ice.candidate.candidate) {
      // 正規表現でIPアドレスを表示する
      // myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate)[1];
      // var match = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
      var match = ice.candidate.candidate;
      if (match && match[1]) {
        myIP = match;
        console.log(myIP);		
        document.getElementById('your_id').innerText += myIP;
        pc.onicecandidate = noop;

      } else {
        console.log('IP address not found');		
      }
    }
  }
};
