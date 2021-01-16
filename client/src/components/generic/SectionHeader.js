import React from "react";
import styles from "./SectionHeader.module.scss";

const SectionHeader = (props) => {
  return <h5 className={styles.sectionHeader}>{props.children}</h5>;
};

export default SectionHeader;
