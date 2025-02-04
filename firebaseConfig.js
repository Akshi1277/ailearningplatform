import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA1-Q0WCfiQYVLFM4bOjusB55ukCzMQzRY",
    authDomain: "ai-learning-platform-16939.firebaseapp.com",
    projectId: "ai-learning-platform-16939",
    storageBucket: "ai-learning-platform-16939.firebasestorage.app",
    messagingSenderId: "645974970990",
    appId: "1:645974970990:web:3dad6e87001178f3604c7f",
    measurementId: "G-XM0NK5MCKC"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);