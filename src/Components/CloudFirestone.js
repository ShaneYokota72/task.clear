// import { collection, addDoc, doc} from "firebase/firestore";
// import {analytics} from '../firebase';


// const docRef = collection(analytics, "UserTask", "Shane");
// const docSnap = await getDoc(docRef);
// if (docSnap.exists()) {
//   const data = docSnap.data().task;
//   console.log(data); // Output: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
// }

// const docRef = doc(db, "UserTask", "Shane");
// const docSnap = await getDoc(docRef);
// if (docSnap.exists()) {
//     console.log(docSnap.data().task);
// } else {
//     console.log("no");
// }


// export default async function getTask(username) {
//     const docRef = doc(db, "UserTask", username);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       return docSnap.data().task;
//     } else {
//       throw new Error("No such document");
//     }
//   }

// import { deleteDoc, doc } from "firebase/firestore";
// import {db} from '../firebase';

// console.log("delete happened");