import styles from "./page.module.scss";

const shelvesStore = {
  standHeight: 2000,
  standWidth: 500,
  scale: 0.3,
  shelfSpacings: [100, 200, 1670],
};

export default function Home() {
  let shelfBoxesArr = [];
  const scale = shelvesStore.scale;
  const standWidth = shelvesStore.standWidth * scale;
  const standHeight = shelvesStore.standHeight * scale;
  const shelfHeight = 10 * scale;
  const edgeHeight = 10 * scale;
  const edgeWidth = 10 * scale;

  let marginTop = edgeHeight;
  for (let shelfSpacing of shelvesStore.shelfSpacings) {
    shelfBoxesArr.push(
      <div
        className={styles.box}
        style={{
          width: `calc(${standWidth}px - ${edgeWidth * 2}px)`,
          height: `${shelfSpacing}px`,
          top: `calc(50% - ${standHeight / 2}px + ${marginTop * scale}px - 2px)`,
          left: `calc(50% - ${standWidth / 2}px + ${edgeWidth}px - 2px)`,
        }}
      />,
    );
    marginTop += shelfSpacing + shelfHeight;
  }

  return (
    <main className={styles.main}>
      <div className={styles.menu}>
        <div
          className={styles.box}
          style={{
            width: standWidth + "px",
            height: standHeight + "px",
            top: `calc(50% - ${standHeight / 2}px)`,
            left: `calc(50% - ${standWidth / 2}px)`,
          }}
        >
          {shelfBoxesArr}
        </div>
      </div>
    </main>
  );
}
