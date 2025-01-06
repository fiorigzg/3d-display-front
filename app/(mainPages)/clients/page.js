"use client";

import { useCliensStore } from "store/clientsStore";

import styles from "./page.module.scss";

import VInput from "components/VInput";
import HInput from "components/HInput";
import VSelect from "components/VSelect";
import SelectList from "components/SelectList";
import Block from "components/Block";
import Subblock from "components/Subblock";
import ColorBtn from "components/ColorBtn";

export default function Home() {
	const clientsStore = useCliensStore();
	console.log(clientsStore)

	let filtredClients = clientsStore.clients.filter(client => client.name.includes(clientsStore.clientNameFilter));

	let clientsArr = [];
	for(const client of filtredClients) {
		let productsArr = [];
		for(const product of client.products) {
			productsArr.push(<Subblock key={product.id}>
				<VInput
					value={product.name}
					onChange={value => clientsStore.setProductValue(client.id, product.id, "name", value)}
					text="Название продукта"
					placeholder="Введите название"
					disabled={product.isMade}
				/>
				<HInput
					value={product.object.value}
					type="file"
					unit=".obj"
					onChange={(value, files) => clientsStore.setProductValue(client.id, product.id, "object", {value: value, files: files})}
					text="Объект"
					disabled={product.isMade}
				/>
				<HInput
					value={product.frontalProjection.value}
					type="file"
					unit=".svg"
					onChange={(value, files) => clientsStore.setProductValue(client.id, product.id, "frontalProjection", {value: value, files: files})}
					text="Передняя проекция"
					twoLines={true}
					disabled={product.isMade}
				/>
				<HInput
					value={product.sideProjection.value}
					type="file"
					unit=".svg"
					onChange={(value, files) => clientsStore.setProductValue(client.id, product.id, "sideProjection", {value: value, files: files})}
					text="Боковая проекция"
					twoLines={true}
					disabled={product.isMade}
				/>
				<div className={styles.subblockEndBtns}>
					<ColorBtn
						text="Выложить"
						disabledText="Выложено"
						icon="/rightArrow.svg"
						className={styles.makeStandBtn}
						onClick={() => clientsStore.setProductValue(client.id, product.id, "isMade", {value: value, files: files})}
						disabled={product.isMade}
					/>
					<ColorBtn
						text="Удалить"
						color="#e16c6c"
						icon="/trash.svg"
						onClick={() => clientsStore.deleteProduct(client.id, product.id)}
					/>
				</div>
			</Subblock>);
		}

		clientsArr.push(<Block key={client.id}>
			<VInput
				value={client.name}
				onChange={value => clientsStore.setClientValue(client.id, "name", value)}
				text="Название клиента"
				placeholder="Введите название"
				className={styles.blockStartInput}
			/>
			{productsArr}
			<ColorBtn
				text="Добавить"
				icon="/plus.svg"
				onClick={() => clientsStore.addProduct(client.id)}
			/>
			<div className={styles.blockEndBtns}>
				<ColorBtn
					text="Удалить"
					color="#e16c6c"
					icon="/trash.svg"
					onClick={() => clientsStore.deleteClient(client.id)}
				/>
			</div>
		</Block>);
	}

	return (
		<main>
			<div className={styles.menu}>
				<div className={styles.clientFindMenu}>
					<VInput 
						value={clientsStore.clientNameFilter}
						onChange={value => clientsStore.setClientNameFilter(value)}
						text="Поиск по названию клиента"
						placeholder="Поиск клиента"
					/>
				</div>
			</div>
			<div className={styles.workingSpace}>
				<div className={styles.title}>
					<h1 className={styles.titleText}>Клиенты и товары</h1>
					<ColorBtn
						text="Добавить"
						icon="/plus.svg"
						onClick={() => clientsStore.addClient()}
					/>
				</div>
				{clientsArr}
			</div>
		</main>
	);
}
