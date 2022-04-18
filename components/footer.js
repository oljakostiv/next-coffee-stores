import Image from "next/image";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/oljakostiv"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.text}>Created by Olha Kostv</span>
        <Image src="/github-1.svg" alt="github Logo" width={20} height={20} />
      </a>
    </footer>
  );
};

export default Footer;
