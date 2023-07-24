$(function() {
  $('#file-select-button').click(function(event) {
    event.preventDefault();
    $('input[name="image"]').click();
  });

  $('input[name="image"]').change(function() {
    var fileName = $(this).val().split('\\').pop(); // 获取文件名
    $('#file-select-button').text(fileName); // 显示文件名
  });

  $('#upload-form').submit(function(event) {
    event.preventDefault();

    var form = $(this);
    var url = form.attr('action') || window.location.href;
    var data = new FormData(form[0]);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://arous.eu.org/function.php', true);

    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable) {
        var percentComplete = (event.loaded / event.total) * 100;
      }
    };

    xhr.onload = function() {
      var responseArray = xhr.responseText.split("\n"); // 将响应拆分为两行

      $('#image-origin-url').text(responseArray[0]); // 更新页面上的原始图片 URL
      $('#image-origin-url').attr('data-clipboard-text', responseArray[0]); // 设置复制文本

      $('#image-proxied-url').text(responseArray[1]); // 更新页面上的代理后图片 URL
      $('#image-proxied-url').attr('data-clipboard-text', responseArray[1]); // 设置复制文本
      
      $('#image-speed-url').text(responseArray[2]); // 更新页面上的代理后图片 URL
      $('#image-speed-url').attr('data-clipboard-text', responseArray[1]); // 设置复制文本

      $('#file-select-button').text('选择图片');
    };

    xhr.onerror = function() {
      console.log("Error occurred while uploading the file.");
    };

    xhr.send(data);
  });

  // 监听粘贴事件
  $(document).on('paste', (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;

    // 清空 input[name="image"] 元素的值
    $('input[name="image"]').val('');

    if (!$('input[name="image"]').prop('files')[0]) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();

          // 更新文件名和数据，并触发change事件
          const fileList = new DataTransfer();
          fileList.items.add(file);
          $('input[name="image"]')
            .prop('files', fileList.files)
            .trigger('change');

          // 调用上传图片按钮的上传方法
          $('#upload-button').click();
        }
      }
    } else {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();

          // 更新文件名和数据，并触发change事件
          const fileList = new DataTransfer();
          fileList.items.add(file);
          $('input[name="image"]')
            .prop('files', fileList.files)
            .trigger('change');
        }
      }
    }
  });

  // 初始化 clipboard.js 库
  var clipboard = new ClipboardJS('.copy-button');
  clipboard.on('success', function(e) {
    var message = document.createElement('div');
    message.textContent = '已成功复制 URL 到剪贴板：' + e.text;
    message.style.position = 'fixed';
    message.style.top = '95%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '10px';
    message.style.borderRadius = '5px';
    message.style.zIndex = '9999';
    document.body.appendChild(message);

    setTimeout(function() {
      message.parentNode.removeChild(message);
    }, 1500);

    e.clearSelection();
  });
});
