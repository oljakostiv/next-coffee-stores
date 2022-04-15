import Image from "next/image";
import styles from "../styles/Home.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/oljakostiv"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.mr1}>Created by Olha Kostv</span>
        <Image src="/github-1.svg" alt="github Logo" width={30} height={30} />
      </a>
    </footer>
  );
};

export default Footer;
