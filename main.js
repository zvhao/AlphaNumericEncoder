// Bảng mã hóa ký tự
const encodeMap = {
   a: "2",
   b: "13",
   c: "6",
   d: "10",
   e: "3",
   f: "*",
   g: "9",
   h: "76",
   i: "1",
   j: "*",
   k: "16",
   l: "1",
   m: "111",
   n: "11",
   o: "0",
   p: "10",
   q: "01",
   r: "12",
   s: "5",
   t: "7",
   u: "4",
   v: "8",
   w: "*",
   x: "26",
   y: "12",
   z: "*",
 };
 
 // Hàm chuyển tiếng Việt có dấu thành không dấu và chữ thường
 function removeDiacritics(text) {
   return text
     .normalize("NFD")
     .replace(/[\u0300-\u036f]/g, "")
     .toLowerCase();
 }
 
 // Hàm mã hóa, giữ nguyên khoảng trắng
 function encodeText(text) {
   return text
     .split("")
     .map((char) => (char === " " ? " " : encodeMap[char] || "")) // Giữ nguyên khoảng trắng
     .join("")
     .trim();
 }
 
 // Cập nhật danh sách mã hóa từ localStorage
 function updateEncodedList() {
   $("#encodedList").empty();
   const encodedItems = JSON.parse(localStorage.getItem("encodedList")) || [];
   encodedItems.forEach((item, index) => {
     $("#encodedList").append(
       `<li class="flex justify-between items-center">
             <span>${item}</span>
             <button onclick="removeItem(${index})" class="text-red-500 ml-4">Xóa</button>
           </li>`
     );
   });
 }
 
 // Sự kiện khi nhập vào ô input
 $("#inputText").on("input", function () {
   const originalText = $(this).val();
   const text = removeDiacritics(originalText);
   const encoded = encodeText(text);
   $("#encodedText").val(encoded);
 });
 
 // Lưu mã hóa khi nhấn Enter, xử lý khoảng cách khi nhấn Space
 $("#inputText").on("keypress", function (event) {
   // Khi nhấn Space, thêm khoảng trắng vào ô mã hóa
   if (event.key === " ") {
     let currentEncodedText = $("#encodedText").val();
     $("#encodedText").val(currentEncodedText + " ");
   }
   // Khi nhấn Enter
   else if (event.key === "Enter") {
     saveEncodedText(); // Gọi hàm để lưu mã hóa
     event.preventDefault(); // Ngăn không cho form submit
   }
 });
 
 // Khi nhấn vào nút Save (btn-save)
 $(".btn-save").on("click", function () {
   saveEncodedText(); // Gọi hàm để lưu mã hóa khi nhấn nút Save
 });
 
 // Hàm để lưu mã hóa
 function saveEncodedText() {
   const originalText = $("#inputText").val();
   const text = removeDiacritics(originalText); // Xóa dấu và chuyển chữ thường
   const encoded = encodeText(text); // Mã hóa văn bản
 
   if (text.trim() && encoded) {
     let encodedList = JSON.parse(localStorage.getItem("encodedList")) || [];
     encodedList.push(`${originalText} => ${encoded}`);
     localStorage.setItem("encodedList", JSON.stringify(encodedList)); // Lưu vào localStorage
     updateEncodedList(); // Cập nhật danh sách mã hóa hiển thị
     $("#inputText").val(""); // Xóa ô input sau khi lưu
     $("#encodedText").val(""); // Xóa ô mã hóa
   }
 }
 
 // Xóa dòng mã hóa từ localStorage
 function removeItem(index) {
   let encodedList = JSON.parse(localStorage.getItem("encodedList")) || [];
   encodedList.splice(index, 1);
   localStorage.setItem("encodedList", JSON.stringify(encodedList));
   updateEncodedList();
 }
 
 // Sao chép chuỗi mã hóa khi nhấn nút Copy
 $("#copyButton").on("click", function () {
   const encodedText = $("#encodedText").val();
   if (encodedText) {
     navigator.clipboard
       .writeText(encodedText)
       .then(() => {
         alert("Đã sao chép mã hóa vào clipboard!");
       })
       .catch((err) => {
         console.error("Không thể sao chép", err);
       });
   }
 });
 
 // Khởi tạo danh sách mã hóa từ localStorage khi tải trang
 $(document).ready(function () {
   updateEncodedList();
 });
 