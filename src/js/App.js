import React from "react";
import { hot } from "react-hot-loader/root";
import styles from "../sass/app.module";
import avatar from "../img/avatar.png";

function App() {
  return (
    <div className={styles.content}>
      <h1>Hello, World!</h1>
      <img className="img-circle" src={avatar} alt="Avatar" />
      <h2 className="color-white">This is our Frontend Application</h2>
      <p>Using Webpack and React</p>
    </div>
  );
}

export default hot(App);
