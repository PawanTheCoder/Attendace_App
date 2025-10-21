import styles from './Loader.module.css';

export default function Loader({
	text = 'Loading...',
	variant = 'spinner', // 'spinner' | 'dots' | 'pulse' | 'bars' | 'skeleton'
	size = 'medium', // 'small' | 'medium' | 'large'
	color = 'primary', // 'primary' | 'secondary' | 'success' | 'danger' | 'custom'
	customColor = '#4f46e5',
	fullScreen = false,
	overlay = false,
	className = ''
}) {
	const loaderContent = (
		<div className={`${styles.loaderContainer} ${styles[size]} ${className}`}>
			{/* Spinner Variant */}
			{variant === 'spinner' && (
				<div
					className={`${styles.spinner} ${styles[color]}`}
					style={color === 'custom' ? { borderTopColor: customColor } : {}}
				/>
			)}

			{/* Dots Variant */}
			{variant === 'dots' && (
				<div className={styles.dots}>
					<div className={`${styles.dot} ${styles[color]}`} style={color === 'custom' ? { backgroundColor: customColor } : {}} />
					<div className={`${styles.dot} ${styles[color]}`} style={color === 'custom' ? { backgroundColor: customColor } : {}} />
					<div className={`${styles.dot} ${styles[color]}`} style={color === 'custom' ? { backgroundColor: customColor } : {}} />
				</div>
			)}

			{/* Pulse Variant */}
			{variant === 'pulse' && (
				<div
					className={`${styles.pulse} ${styles[color]}`}
					style={color === 'custom' ? { backgroundColor: customColor } : {}}
				/>
			)}

			{/* Bars Variant */}
			{variant === 'bars' && (
				<div className={styles.bars}>
					<div className={`${styles.bar} ${styles[color]}`} style={color === 'custom' ? { backgroundColor: customColor } : {}} />
					<div className={`${styles.bar} ${styles[color]}`} style={color === 'custom' ? { backgroundColor: customColor } : {}} />
					<div className={`${styles.bar} ${styles[color]}`} style={color === 'custom' ? { backgroundColor: customColor } : {}} />
				</div>
			)}

			{/* Skeleton Variant */}
			{variant === 'skeleton' && (
				<div className={styles.skeleton}>
					<div className={styles.skeletonLine} />
					<div className={styles.skeletonLine} />
					<div className={styles.skeletonLine} />
				</div>
			)}

			{/* Loading Text */}
			{text && variant !== 'skeleton' && (
				<span className={styles.loaderText}>{text}</span>
			)}
		</div>
	);

	// Full screen overlay
	if (fullScreen) {
		return (
			<div className={styles.fullScreenOverlay}>
				{loaderContent}
			</div>
		);
	}

	// Regular overlay
	if (overlay) {
		return (
			<div className={styles.overlay}>
				{loaderContent}
			</div>
		);
	}

	// Inline loader
	return loaderContent;
}