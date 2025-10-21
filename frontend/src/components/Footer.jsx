import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>© {new Date().getFullYear()} Attendance App</div>
      <div>Built with care</div>
    </footer>
  )
}
