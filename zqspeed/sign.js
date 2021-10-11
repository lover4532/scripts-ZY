getExtraParams(version) {
    TreeMap treeMap = new TreeMap();
    Context appContext = MyApp.getAppContext();
    Map<String, String> map = treeMap;
    map.put("uid", MyApp.getUser().getUserId());
    map.put("language", AppUtil.getLocaleLanguage());
    map.put(ai.y, Build.DISPLAY);
    map.put("os_api", String.valueOf(Build.VERSION.SDK_INT));
    map.put(ai.F, Build.BRAND);
    map.put("device_model", Build.MODEL);
    map.put("device_id", PrefernceUtils.getString(109));
    String str = DeviceInfoUtils.DEVICE_OAID;
    String str2 = "";
    if (str == null) {
        str = str2;
    }
    map.put("oaid", str);
    map.put("s_im", ZQNetUtils.getSecurityParamsByDES(DeviceInfoUtils.DEVICE_IMEI));
    map.put("s_ad", ZQNetUtils.getSecurityParamsByDES(DeviceInfoUtils.DEVICE_ANDROID_ID));
    map.put("dpi", String.valueOf(DeviceScreenUtils.getmDensityDpi()));
    map.put("app_name", "zqkd_app");
    map.put("app_version", PackageUtils.getAppVersoin());
    map.put("version_code", String.valueOf(PackageUtils.getAppCode()));
    map.put("jssdk_version", str2);
    map.put("inner_version", PackageUtils.getInnerVersion());
    map.put("rom_version", Build.DISPLAY);
    map.put("channel", MyApp.getChannel());
    map.put(ai.T, NetCheckUtils.getNetworkTypeName(appContext));
    map.put("carrier", DeviceInfoUtils.getNetworkOperatorName());
    map.put("ab_version", str2);
    map.put("ab_feature", str2);
    map.put("ab_client", str2);
    map.put("resolution", String.valueOf(DeviceScreenUtils.mDeviceWidth) + "x" + DeviceScreenUtils.mDeviceHeight);
    try {
        treeMap.put("sm_device_id", SmAntiFraud.getDeviceId());
    } catch (Exception e2) {
        e2.printStackTrace();
    }
    map.put("zqkey_id", MyApp.getUser().zqkey_id);
    map.put("zqkey", MyApp.getUser().zqkey);
    String str3 = "1";
    map.put(CommonAdModel.MI, CommonUtil.isXiaomi() ? str3 : "0");
    map.put("mobile_type", str3);
    map.put(HiAnalyticsConstant.BI_KEY_NET_TYPE, String.valueOf(NetCheckUtils.getNetworkTypeNameInt(appContext)));
    map.put("device_platform", "android");
    map.put("storage", MemoryAndCpuUtils.getTotalSdCardSize());
    map.put("memory", MemoryAndCpuUtils.getTotalMemorySize());
    String str4 = "2";
    if (i == 1 || i == 2) {
        map.put("device_type", str4);
        map.put("openudid", DeviceInfoUtils.DEVICE_ID);
        map.put("channel_code", MyApp.getChannel());
        map.put("phone_network", NetCheckUtils.getNetworkTypeName(appContext));
        map.put("phone_code", DeviceInfoUtils.DEVICE_ID);
        map.put("client_version", PackageUtils.getAppVersoin());
        map.put("uuid", PrefernceUtils.getString(59));
        if (DeviceInfoUtils.hasSIMCard()) {
            str4 = str3;
        }
        map.put("phone_sim", str4);
        map.put("request_time", String.valueOf(System.currentTimeMillis() / ((long) 1000)));
        if (MyApp.isDebug()) {
            str2 = str3;
        }
        map.put("debug", str2);
    } else if (i == 3 || i == 4) {
        map.put("device_type", "android");
        map.put("openudid", DeviceInfoUtils.DEVICE_ID);
        map.put("iid", PrefernceUtils.getString(60));
        map.put(ai.Q, NetCheckUtils.getNetworkTypeName(appContext));
        map.put("request_time", String.valueOf(System.currentTimeMillis() / ((long) 1000)));
        if (DeviceInfoUtils.hasSIMCard()) {
            str4 = str3;
        }
        map.put("phone_sim", str4);
        if (MyApp.isDebug()) {
            str2 = str3;
        }
        map.put("debug", str2);
    } else if (i == 5) {
        map.put("device_type", "android");
        map.put("openudid", DeviceInfoUtils.DEVICE_ID);
        map.put("request_time", String.valueOf(System.currentTimeMillis() / ((long) 1000)));
    } else if (i != 16) {
        map.put("device_type", "android");
        map.put("openudid", DeviceInfoUtils.DEVICE_ID);
        map.put("app-version", PackageUtils.getAppVersoin());
        map.put("subv", "1.2.2");
        map.put("request_time", String.valueOf(System.currentTimeMillis() / ((long) 1000)));
        map.put(ai.Q, NetCheckUtils.getNetworkTypeName(appContext));
        if (!DeviceInfoUtils.hasSIMCard()) {
            str3 = str4;
        }
        map.put("sim", str3);
    } else {
        map.put("device_type", Build.DEVICE);
        map.put("openudid", DeviceInfoUtils.DEVICE_ID);
        map.put("ac", String.valueOf(NetCheckUtils.getNetworkTypeNameInt(appContext)));
        map.put("version_name", PackageUtils.getAppName());
        map.put("ts", String.valueOf(System.currentTimeMillis() / ((long) 1000)));
    }
    return map;
}