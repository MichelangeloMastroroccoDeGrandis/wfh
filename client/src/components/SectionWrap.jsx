import styles from '../styles/SectionWrap.module.css'; 
const SectionWrap = ({ children }) => {
  return (
    <div className={styles.sectionWrap}>
      {children}
    </div>
  );
}

export default SectionWrap;