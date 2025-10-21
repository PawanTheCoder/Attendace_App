import styles from './LoginForm.module.css'

export default function LoginForm({ isLogin=true, username, password, setUsername, setPassword, onToggle, onSubmit, error }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{isLogin ? 'Log In' : 'Sign Up'}</h2>
      <form className={styles.form} onSubmit={onSubmit}>
        <input className={styles.input} placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
        <input className={styles.input} placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className={styles.primary} type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
        <button type="button" className={styles.secondary} onClick={onToggle}>{isLogin ? 'Go to Sign Up' : 'Go to Log In'}</button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
      <div className={styles.hint}><b>Teacher credentials</b>: username "sara", password "sara06"</div>
    </div>
  )
}
