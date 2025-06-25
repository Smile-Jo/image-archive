import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage, ref, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "../firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const container = document.getElementById("image-list-container");

async function loadImages() {
  const snapshot = await getDocs(collection(db, "images"));
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "image-card";
    div.innerHTML = `
      <p><strong>문항 ID:</strong> ${data.itemId}</p>
      <p><strong>대상 학년:</strong> ${data.grade}</p>
      <p><strong>영역:</strong> ${data.subject}</p>
      <img src="${data.imageUrl}" alt="이미지" width="200" />
      <p><a href="${data.imageUrl}" target="_blank">이미지 URL 열기</a></p>
      <button data-id="${docSnap.id}" data-url="${data.imageUrl}">삭제</button>
      <hr/>
    `;
    container.appendChild(div);
  });

  container.addEventListener("click", async (e) => {
    if (e.target.tagName === "BUTTON") {
      const id = e.target.dataset.id;
      const url = e.target.dataset.url;
      const filePath = decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0]);

      if (confirm("정말 삭제하시겠습니까?")) {
        await deleteDoc(doc(db, "images", id));
        await deleteObject(ref(storage, filePath));
        alert("삭제 완료!");
        location.reload();
      }
    }
  });
}

loadImages();