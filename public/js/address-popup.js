function execFindAddress() {
  new daum.Postcode({
    oncomplete: function(data) {
      const postCode = document.getElementById('postcode');
      const roadAddress = document.getElementById('roadAddress');
      const jibunAddress = document.getElementById('jibunAddress');
      const extraAddress = document.getElementById('extraAddress');

      postCode.value = data.zonecode;
      postCode.style.display = 'block';
      roadAddress.value = data.roadAddress;
      jibunAddress.value = data.jibunAddress;
      if (data.userSelectedType === 'R') roadAddress.style.display = 'block';
      else jibunAddress.style.display = 'block';
      extraAddress.style.display = 'block';
    }
  }).open();
};