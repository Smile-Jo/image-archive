import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const form = document.getElementById("upload-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemId = document.getElementById("item-id").value;
  const grade = document.getElementById("grade").value;
  const subject = document.getElementById("subject").value;
  const file = document.getElementById("image-file").files[0];

  if (!file) {
    alert("이미지를 선택해주세요.");
    return;
  }

  const timestamp = Date.now();
  const storageRef = ref(storage, `images/${timestamp}_${file.name}`);

  try {
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    await addDoc(collection(db, "images"), {
      itemId,
      grade,
      subject,
      imageUrl: downloadURL,
      createdAt: Timestamp.now()
    });

    alert("업로드 완료!");
    form.reset();
  } catch (error) {
    console.error("업로드 실패:", error);
    alert("업로드 중 오류가 발생했습니다.");
  }
});