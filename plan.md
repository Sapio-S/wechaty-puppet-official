# 暑期2020 基于开放 API 封装 Wechaty 接口下的企业微信聊天机器人 计划书

## 暑期2020
“开源软件供应链点亮计划-暑期2020”（以下简称 暑期2020）是由中科院软件所与 openEuler 社区共同举办的一项面向高校学生的暑期活动。
旨在鼓励在校学生积极参与开源软件的开发维护，促进国内优秀开源软件社区的蓬勃发展。
根据项目的难易程度和完成情况，参与者还可获取“开源软件供应链点亮计划-暑期2020”活动奖金和奖杯。
官网：https://isrc.iscas.ac.cn/summer2020 官方新闻：http://www.iscas.ac.cn/xshd2016/xshy2016/202004/t20200426_5563484.html
本项目 [基于开放 API 封装 Wechaty 接口下的企业微信聊天机器人] 系 暑期2020 支持的开源项目。

## [基于开放 API 封装 Wechaty 接口下的企业微信聊天机器人]具体计划

- 导师：高原，李佳芮
- 学生：谢昱清
- 模块列表
    - 设计配置参数
    - 接入企业微信会话存档接口读取消息
    - 实现 puppet 上各个类型的消息接口
    - 定时读取消息，并在读取消息之后触发消息事件
    - 企业微信会话存档 puppet 的使用文档
- 计划安排：
    - 模块一：设计配置参数
        - [预期完成时间] 2020.7.19
        - [模块描述] 拓展puppet的数据存储结构，在 wechaty-puppet-official-schemas.ts 中确定数据结构。
        - [备注] https://github.com/wechaty/wechaty-puppet-padchat/issues/33 中的1。
    - 模块二：接入企业微信会话存档接口读取消息
        - [预期完成时间] 2020.7.26
        - [模块描述] 与web socket建立连接，完成contactRawPayload()，contactRawPayloadParser()，messageRawPayload()， messageRawPayloadParser()等函数。
        - [备注] https://github.com/wechaty/wechaty-puppet-padchat/issues/33 中的2-4。
    - 模块三：实现 puppet 上各个类型的消息接口
        - [预期完成时间] 2020.8.30（2020.8.2前成功运行 ding-dong-bot ）
        - [模块描述] 完成消息的读取及更多功能的函数，如消息的存储及群聊相关的内容。
        - [备注]  https://github.com/wechaty/wechaty-puppet-padchat/issues/33 中的5-10与12。
    - 模块四：定时读取消息，并在读取消息之后触发消息事件
        - [预期完成时间] 2020.9.6
        - [模块描述] 建立watchdog监听消息。
        - [备注]  https://github.com/wechaty/wechaty-puppet-padchat/issues/33 中的11与13。
    - 模块五：企业微信会话存档 puppet 的使用文档
        - [预期完成时间] 2020.9.20
        - [模块描述] 在原puppet使用文档上增改部分内容。
        - [备注]
- 项目链接：https://github.com/Sapio-S/wechaty-puppet-official/
- 联系方式：1205402283@mail.qq.com