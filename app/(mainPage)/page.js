import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.main}>
      <img src="/logo.svg" />
      <div className={styles.navigation}>
        <a href="/clients" className={styles.navCard}>
          <h3>Клиенты</h3>
          <p>Управление клиентской базой</p>
        </a>
        <a href="/projects" className={styles.navCard}>
          <h3>Проекты</h3>
          <p>Управление проектами</p>
        </a>
        <a href="/products" className={styles.navCard}>
          <h3>Продукты</h3>
          <p>Каталог продуктов</p>
        </a>
        <a href="/prepackTypes" className={styles.navCard}>
          <h3>Типы препаков</h3>
          <p>Настройка типов препаков</p>
        </a>
        <a href="/packageTypes" className={styles.navCard}>
          <h3>Типы упаковок</h3>
          <p>Управление упаковками</p>
        </a>
        <a href="/categories" className={styles.navCard}>
          <h3>Категории продуктов</h3>
          <p>Классификация продуктов</p>
        </a>
        <a href="/staffMembers" className={styles.navCard}>
          <h3>Сотрудники</h3>
          <p>Управление персоналом</p>
        </a>
      </div>
    </main>
  );
}
