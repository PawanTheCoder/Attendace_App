import styles from './Card.module.css'

function Card({ title, children, footer }) {
	return (
		<div className={styles.card}>
			{title && <div className={styles.title}>{title}</div>}
			<div className={styles.body}>{children}</div>
			{footer && <div className={styles.footer}>{footer}</div>}
		</div>
	);
}

export default Card;


