import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../components/Loading';
import {
	addUserDetailAction,
	cancelConfirmProofAction,
	confirmProofAction,
	fetchUserActivityAction,
	getImageProofAction,
} from '../store/actions';
import { Table, Layout, Button, Switch, Select, Tag, Space, Modal } from 'antd';
import styles from '../styles/Admin.module.css';
import useModelOnlyShowActivity from '../hooks/useModelOnlyShowActivity';
import InputSelectWithAddItem from '../components/InputSelectWithAddItem';
import {
	fieldPesonal,
	nameDepartmentActivity,
	nameLevelActivity,
	nameLevelRegister,
	nameMajors,
	nameSex,
	nameTarget,
} from '../config';
import TableCustom from '../components/TableCustom';
import useModelUser from '../hooks/useModelUser';
import { CSVLink } from 'react-csv';

const { Content } = Layout;
const { confirm } = Modal;

let option = [
	{
		key: 'false',
		label: 'Chưa xác nhận',
		style: {
			backgroundColor: 'white',
		},
	},
	{
		key: 'true',
		label: 'Đã xác nhận',
		style: {
			backgroundColor: '#95de64',
		},
	},
	{
		key: 'Minh chứng không hợp lệ',
		label: 'Minh chứng không hợp lệ',
		style: {
			backgroundColor: '#ff7875',
		},
	},
];

const options = [
	{ value: 'hoc-tap', label: 'Học tập', color: '#ff9c6e' },
	{ value: 'tinh-nguyen', label: 'Tình nguyện', color: '#ffc53d' },
	{ value: 'the-luc', label: 'Thể lực', color: '#bae637' },
	{ value: 'dao-duc', label: 'Đạo đức', color: '#f759ab' },
	{ value: 'hoi-nhap', label: 'Hội nhập', color: '#40a9ff' },
];
const colorOption = {
	'hoc-tap': '#ff9c6e',
	'tinh-nguyen': '#ffc53d',
	'the-luc': '#bae637',
	'dao-duc': '#f759ab',
	'hoi-nhap': '#40a9ff',
};
const headerCsv = Object.entries(fieldPesonal).map(([k, v]) => ({
	label: v.label,
	key: k,
}));
export default function AdminManageUser() {
	const dispatch = useDispatch();
	const [csvData, setCsvData] = useState([]);
	let { value: listUser, loading } = useSelector(
		(state) => state.userActivity
	);
	let { ui, setVisible, setDataModel } = useModelOnlyShowActivity({
		title: 'Chi tiết hoạt động.',
	});
	let {
		ui: uiUserDetail,
		setVisible: setVisibleUserModel,
		setDataModel: setDataModelUser,
	} = useModelUser({
		title: 'Chi tiết người dùng',
	});
	useEffect(async () => {
		if (listUser.length === 0)
			dispatch(fetchUserActivityAction()).catch((error) =>
				console.log(error.message)
			);
	}, []);

	const filterctivity = (listActivity = [], condition = {}) => {
		return listActivity
			.filter(
				(activity) =>
					activity.confirm === true &&
					activity?.images &&
					activity.images.length !== 0
			)
			.filter((avtivity) => {
				Object.entries(condition).forEach(([k, v]) => {
					if (k === 'target')
						return v.every((e) => avtivity.target.includes(e));
					if (k === 'name')
						return (
							avtivity.name
								.toLowerCase()
								.indexOf(v.toLowerCase()) !== -1
						);
					else if (avtivity[k] !== v) return false;
				});
				return true;
			})
			.map((c) => c.images.map((d) => d.url).join(', '))
			.join(', ');
	};
	useEffect(() => {
		if (loading === 0 && csvData.length) {
			setCsvData(
				csvData.map((c) => ({
					...c,
					sex: nameSex[c.sex],
					targetSuccess: c.targetSuccess.length
						? c.targetSuccess.map((c) => nameTarget[c]).join('-')
						: '',
					majors: nameMajors[c.majors],
					department: nameDepartmentActivity[c.department],
					levelReview: nameLevelRegister[c.levelReview],
					targetOtherSuccess: filterctivity(c.listData, {
						name: 'tiêu biểu',
						typeActivity: 'other',
					}),
					targetHoiNhap: filterctivity(c.listData, {
						target: ['hoi-nhap'],
					}),
					targetKyNang: filterctivity(c.listData, {
						name: 'về hội nhập',
						target: ['hoi-nhap'],
					}),
					targetNgoaiNgu: filterctivity(c.listData, {
						name: 'về ngoại ngữ',
						target: ['hoi-nhap'],
					}),
					targetTinhNguyen: filterctivity(c.listData, {
						target: ['tinh-nguyen'],
					}),
					targetTheLuc: filterctivity(c.listData, {
						target: ['the-luc'],
					}),
					otherHocTap: filterctivity(c.listData, {
						target: ['hoc-tap'],
						typeActivity: 'other',
					}),
					requireHocTap: filterctivity(c.listData, {
						target: ['hoc-tap'],
						typeActivity: 'require',
					}),
					otherDaoDuc: filterctivity(c.listData, {
						target: ['dao-duc'],
						typeActivity: 'other',
					}),
					requireDaoDuc: filterctivity(c.listData, {
						target: ['dao-duc'],
						typeActivity: 'require',
					}),
				}))
			);
		}
	}, [loading]);
	const handleConfirm = (uid, acId, confirm) => {
		console.log('handle confirm: ', { uid, acId, confirm });
		if (confirm === 'true') dispatch(confirmProofAction({ uid, acId }));
		else if (confirm === 'false')
			dispatch(cancelConfirmProofAction({ uid, acId, confirm: false }));
		else dispatch(cancelConfirmProofAction({ uid, acId, confirm }));
	};
	const handleClickNameActivity = (item, uid) => {
		setDataModel({ ...item, uid });
		setVisible(true);
	};
	const handleShowUserDetail = (item) => {
		console.log(item);
		setDataModelUser(item);
		setVisibleUserModel(true);
	};
	const handleChangeTargetSuccess = (value, item) => {
		dispatch(
			addUserDetailAction({
				uid: item.userId,
				data: { targetSuccess: value },
			})
		).then((res) => {
			console.log('them thanh cong');
		});
	};
	const expandedRowRender = (user) => {
		const columns = [
			{
				title: 'Trạng thái',
				dataIndex: 'active',
				key: 'active',
				filters: [
					{
						text: 'Chưa kích hoạt',
						value: 'false',
					},
					{
						text: 'Đã kích hoạt',
						value: 'true',
					},
				],
				defaultFilteredValue: ['true'],
				onFilter: (value, record) => record.active.toString() === value,
				render: (text) => <Switch checked={text} size="small" />,
			},
			{
				title: 'Tên hoạt động',
				key: 'name',
				render: (item) => {
					return (
						<Button
							type="link"
							onClick={() =>
								handleClickNameActivity(item, user.userId)
							}
						>
							{item.name}
						</Button>
					);
				},
			},
			{
				title: 'Cấp hoạt động',
				dataIndex: 'level',
				key: 'level',
				render: (text) => nameLevelActivity[text],
			},
			{
				title: 'Tiêu chí',
				key: 'target',
				render: (item) =>
					item.target.map((c) => nameTarget[c]).join(', '),
			},
			{ title: 'Ngày diễn ra', dataIndex: 'date', key: 'date' },
			{
				title: 'Trạng thái',
				key: 'confirm',
				filters: [
					{
						text: 'Đã xác nhận',
						value: 'true',
					},
					{
						text: 'Chưa xác nhận',
						value: 'false',
					},
					{
						text: 'MC không hợp lệ',
						value: 'cancel',
					},
					{
						text: 'Chưa thêm minh chứng',
						value: 'notproof',
					},
				],
				onFilter: (value, record) => {
					if (value === 'notproof') return record.proof === 0;
					else if (value === 'cancel')
						return record.confirm.toString().length > 5;
					else if (value === 'false')
						return record.confirm === false && record.proof !== 0;
					else if (value === 'true') return record.confirm === true;
				},
				defaultFilteredValue: ['false', 'cancel'],
				render: (item) => {
					return (
						<InputSelectWithAddItem
							defaultValue={item.confirm.toString()}
							value={option}
							setValue={(key) =>
								handleConfirm(user.userId, item.id, key)
							}
							style={{
								width: '100%',
								maxWidth: 250,
							}}
						/>
					);
				},
			},
		];

		return (
			<Table
				columns={columns}
				dataSource={
					user.listData.map((c, key) => ({ ...c, key })) || []
				}
				size="small"
				pagination={false}
			/>
		);
	};
	const tagRender = (props) => {
		const { label, value, closable, onClose } = props;
		const onPreventMouseDown = (event) => {
			event.preventDefault();
			event.stopPropagation();
		};

		return (
			<Tag
				color={colorOption[value]}
				onMouseDown={onPreventMouseDown}
				closable={closable}
				onClose={onClose}
				style={{ marginRight: 3 }}
			>
				{label}
			</Tag>
		);
	};
	const handleSelectRowTabel = (record, selected, selectedRows, e) => {
		console.log(selectedRows);

		selectedRows.forEach((student) => {
			student.listData.forEach((activity) => {
				if (activity.confirm && !activity.images)
					dispatch(
						getImageProofAction({
							uid: student.userId,
							acId: activity.id,
						})
					);
			});
		});
		setCsvData(selectedRows);
	};
	const columns = [
		{
			title: 'Tên',
			key: 'name',
			filters: [
				{
					text: 'Có đăng ký hoạt động',
					value: 'registered',
				},
				{
					text: 'Không đăng ký hoạt động',
					value: 'unregistered',
				},
				{
					text: 'Có hoạt động chưa xác nhận',
					value: 'notConfirm',
				},
			],
			onFilter: (value, record) => {
				if (value === 'registered' && record.listData.length !== 0)
					return true;
				else if (
					value === 'unregistered' &&
					record.listData.length === 0
				)
					return true;
				else if (value === 'notConfirm')
					return record.listData.filter((c) => c.confirm === false)
						.length;

				return false;
			},
			// searchFilter: true,
			// defaultFilteredValue: ['notConfirm'],
			render: (item, record) => (
				<Button
					type="link"
					onClick={() => handleShowUserDetail(record)}
				>
					{item.fullName}
				</Button>
			),
		},
		{
			title: 'Mssv',
			key: 'studentCode',
			dataIndex: 'studentCode',
			searchFilter: true,
		},
		{
			title: 'Xét SV5T cấp',
			key: 'levelReview',
			filters: Object.entries(nameLevelRegister).map((c) => ({
				text: c[1],
				value: c[0],
			})),
			onFilter: (value, record) => record.levelReview === value,
			render: (item) => nameLevelRegister[item.levelReview],
		},
		{
			title: 'Lớp',
			key: 'classUser',
			render: (item) => <p>{item.classUser || 'Sv chưa điền'}</p>,
		},
		{
			title: 'Đã hoàn thành',
			key: 'action',
			filters: options.map((c) => ({
				value: c.value,
				text: c.label,
			})),
			onFilter: (value, record) => {
				if (record.targetSuccess)
					return record.targetSuccess.includes(value) || false;
				else return false;
			},
			render: (text, record) => (
				<Select
					maxTagCount="responsive"
					mode="tags"
					placeholder="Tiêu chí đã hoàn thành"
					tagRender={tagRender}
					defaultValue={record.targetSuccess}
					style={{ width: 200 }}
					options={options}
					onChange={(value) =>
						handleChangeTargetSuccess(value, record)
					}
				/>
			),
		},
	];

	const loadTable = (listUser = []) => (
		<TableCustom
			pagination={false}
			columns={columns}
			expandable={{
				rowExpandable: (record) => record.listData.length !== 0,
				expandedRowRender,
			}}
			rowSelection={{
				onSelect: handleSelectRowTabel,
				onSelectAll: handleSelectRowTabel,
			}}
			dataSource={listUser}
			size="small"
		/>
	);
	return (
		<Content className={styles.contentAdminManageUser}>
			<Space direction="horizontal">
				{loading === 0 && csvData.length !== 0 && (
					<CSVLink
						filename={'data.csv'}
						data={csvData}
						target="_blank"
						headers={headerCsv}
					>
						Xuất dữ liệu đã chọn
					</CSVLink>
				)}
			</Space>
			{listUser?.length ? (
				loadTable(listUser.map((c, key) => ({ ...c, key })))
			) : (
				<Loading />
			)}
			{ui()}
			{uiUserDetail()}
		</Content>
	);
}
