import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.less'
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui';

const DefaultShopImg = `https://test.chengniu.com:8072/shop-default.png`;

const DATA: any = [
  {
      "createDate": "2019-10-22 15:41:31",
      "orderName": "标准洗车-五座轿车",
      "serviceCode": "81",
      "orderType": "1",
      "orderNo": "XCKOG1910229065",
      "serOrderNo": null,
      "storeName": "C端动态码核销门店",
      "storeArea": "上海市宝山区蕰川路6号",
      "state": "8",
      "evaState": "1",
      "shopCode": "1563101135085930010",
      "amount": 15,
      "couponAmount": 15,
      "realAmount": null,
      "storePrice": 34,
      "effTime": ""
  },
  {
      "createDate": "2019-10-22 15:16:26",
      "orderName": "标准洗车-SUV/MPV",
      "serviceCode": "3000",
      "orderType": "1",
      "orderNo": "XCJTP1910226530",
      "serOrderNo": null,
      "storeName": "上海景邦汽车技术服务有限公司",
      "storeArea": "海市宝山区蕰川路289号",
      "state": "8",
      "evaState": "1",
      "shopCode": "310113003",
      "amount": 0.01,
      "couponAmount": 0.01,
      "realAmount": null,
      "storePrice": 32,
      "effTime": ""
  },
  {
      "createDate": "2019-10-22 15:02:13",
      "orderName": "标准洗车-五座轿车",
      "serviceCode": "81",
      "orderType": "1",
      "orderNo": "XCRZQ1910227917",
      "serOrderNo": null,
      "storeName": "C端动态码核销门店",
      "storeArea": "上海市宝山区蕰川路6号",
      "state": "8",
      "evaState": "1",
      "shopCode": "1563101135085930010",
      "amount": 15,
      "couponAmount": 15,
      "realAmount": null,
      "storePrice": 34,
      "effTime": ""
  },
  {
      "createDate": "2019-10-22 14:06:36",
      "orderName": "标准洗车-五座轿车",
      "serviceCode": "81",
      "orderType": "1",
      "orderNo": "XCYJD1910227087",
      "serOrderNo": null,
      "storeName": "C端动态码核销门店",
      "storeArea": "上海市宝山区蕰川路6号",
      "state": "2",
      "evaState": "1",
      "shopCode": "1563101135085930010",
      "amount": 15,
      "couponAmount": 0,
      "realAmount": 0,
      "storePrice": 34,
      "effTime": ""
  },
  {
      "createDate": "2019-10-22 14:05:20",
      "orderName": "标准洗车-五座轿车",
      "serviceCode": "81",
      "orderType": "1",
      "orderNo": "XCAUO1910221817",
      "serOrderNo": null,
      "storeName": "C端动态码核销门店",
      "storeArea": "上海市宝山区蕰川路6号",
      "state": "8",
      "evaState": "1",
      "shopCode": "1563101135085930010",
      "amount": 15,
      "couponAmount": 15,
      "realAmount": null,
      "storePrice": 34,
      "effTime": ""
  }
];


const fetchData = (page = 1): any => {
  return new Promise((resolve) => {
    let data = [];
    setTimeout(() => {
      resolve({data: {dataList: data.concat(DATA), pageNum: page}})
    }, 1000);
  })
}
export default class Order extends Component<any, any> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的订单'
  }
	orderList: any[] = [];
  constructor(props: any) {
    super(props);

    const urlParams: any = this.$router.params;

    this.state = {
      tabList: [
        { title: '全部' },
        { title: '待付款' },
        { title: '未消费' },
        { title: '已完成' },
        { title: '退款/取消' },
      ],
      // 订单列表数据
      orderList: [],
      // 是否有更多数据
      hasMore: true,
      // 刷新中
      refreshing: false,
      // 在请求中
      isLoading: true,
      pageNum: 1,
      // 显示加载更多
      showLoadMore: false,
      // 每页条数
      pageSize: 5,
      // 总页码
      pageTotal: 1,
      ...urlParams,
      currentTab: 0,
    };
  }

  componentWillMount() {

  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
    console.log('当前tab', this.state.currentTab);
    this.getOrderList();
  }

  componentDidHide() { }


	/**
	 * @description 点击切换tab标签
	 */
  onClickTabs = (type: number) => {
    if (type === this.state.currentTab) {
      return;
    }
    this.setState({
      // orderList: [],
      currentTab: type,
      pageNum: 1
    }, () => {
      this.getOrderList();
    });
  }

	/**
	 * @description 获取订单列表数据
	 * @param page number 当前请求页码
	 */
  getOrderList = (page = 1) => {
    fetchData(page).then((res: any) => {
      const { orderList } = this.state;
      const { pageNum, dataList } = res.data;
			const showList = [...orderList, ...dataList];
      this.setState({
        pageNum,
        orderList: page > 1 ? showList : dataList,
        showLoadMore: dataList.length > 0,
        isLoading: false,
      })
    }).catch((err: any) => {
      console.log(err);
      this.setState({
        isLoading: false,
      })
    });
  }


  /**
   * @description 页面滚动触底
   */
  onReachBottom() {
    const { isLoading, hasMore, pageNum } = this.state;
    if (isLoading || !hasMore) {
      return;
    }
    this.setState({ isLoading: true });
    this.getOrderList(pageNum + 1);
  }

  render() {
    const { orderList, tabList, currentTab } = this.state;
    console.log(tabList)
    const orderContent = orderList.map((order: any, idx: number) => {
      return (
        <View className="order" key={idx}>
          <View className="order-header">
            <View className="shop-name">
              <AtIcon value='car-logo' size='18' color="#8B8B8B"></AtIcon>
              <View className="text">{order.storeName}</View>
            </View>
            <View className="order-status">未消费</View>
          </View>
          <View className="order-content-wrap">
            <View className="order-content">
              <Image className="shop-pic-container" src={order.storeImg || DefaultShopImg} />
              <View className="order-info">
                <View className="goods-name">{order.orderName}</View>
                <View className="create-time">{order.createDate}</View>
              </View>
            </View>
            <View className="total-info">
              合计：￥{order.couponAmount}
            </View>
          </View>
        </View>
      )
    })
    const tabs = tabList.map((_tab: any, index: number) =>
      <AtTabsPane key={index} className="tab-pane" current={currentTab} index={index} >
        <View className="tab-content" >
          {orderList.length > 0 && orderContent}
        </View>
      </AtTabsPane>
    );
    return (
      <View className='order-list-wrap'>
        <AtTabs swipeable={false} current={currentTab} tabList={tabList} onClick={this.onClickTabs}>
          {tabs}
        </AtTabs>
      </View>
    )
  }
}

