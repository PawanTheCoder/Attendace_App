import Sidebar from './Sidebar.jsx'
import styles from './Layout.module.css'

export default function Layout({ user, children, active, navigate }) {
    return (
        <div className={styles.container}>
            <div className={styles.page}>
                <Sidebar user={user} navigate={navigate} active={active} />
                <main className={styles.main}>{children}</main>
            </div>
        </div>
    )
}