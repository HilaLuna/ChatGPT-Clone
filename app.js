/*

!tarayıcıların depolanma alanları
!local storage ve session storage olarak iki depolanma alanı sunuyor

*/

//localStorage'a veri ekleme
localStorage.setItem("kullaniciAdi", "ömer")
//localStorage'dan veri çekme
const kullaniciAdi = localStorage.getItem("kullaniciAdi")
console.log(kullaniciAdi)