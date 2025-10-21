import styles from './Legend.module.css';

export default function Legend({
	items,
	orientation = 'horizontal', // 'horizontal' | 'vertical'
	size = 'medium', // 'small' | 'medium' | 'large'
	showCount = false,
	className = ''
}) {
	return (
		<div
			className={`${styles.legend} ${styles[orientation]} ${styles[size]} ${className}`}
			role="list"
			aria-label="Legend"
		>
			{items.map((item, index) => (
				<div
					key={index}
					className={styles.legendItem}
					role="listitem"
				>
					<span
						className={styles.colorIndicator}
						style={{ backgroundColor: item.color }}
						aria-hidden="true"
					/>
					<span className={styles.label}>{item.label}</span>
					{showCount && item.count !== undefined && (
						<span className={styles.count}>({item.count})</span>
					)}
					{item.description && (
						<span className={styles.tooltip} data-tooltip={item.description}>
							ℹ️
						</span>
					)}
				</div>
			))}
		</div>
	);
}