/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View, FlatList
} from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScreenContainer, screensEnabled } from 'react-native-screens';


function Home() {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>О приложении!</Text>
    </View>
  );
}

function Quotes({ navigation }) {
  const [data, setData] = useState();
  const [showerror, setShowerror] = useState(false);

  useEffect(() => {
    let isSubscribed = true

    const getData = async () => {

      await fetch("https://poloniex.com/public?command=returnTicker", {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((responseJson) => {

          const k = Object.keys(responseJson);

          const nData = k.map(element => {
            return { name: element, data: responseJson[element] }

          });
          if (isSubscribed) { setData(nData); }

        })
        .catch((error) => {
          console.log("Error", error);
          setShowerror(true);
          return 'error';
        });

    }

    getData();

    const intervalId = setInterval(() => { getData(); }, 5000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    }
  }, []);




  const renderItem = ({ item }) => (
    <View style={{ flex: 1, flexDirection: "row", height: 20 }} >
      <Text style={{ width: 100 }} >{item.name}</Text>
      <Text style={{ width: 100, overflow: "hidden", paddingHorizontal: 5 }} >{item.data.last}</Text>
      <Text style={{ width: 100, overflow: "hidden", paddingHorizontal: 5 }} >{item.data.highestBid}</Text>
      <Text style={{ width: 100 }} >{item.data.percentChange}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center' }}>
        <Text>Котировки!</Text>

        <View>
          {showerror ? (<View><Text>Ошибка получения данных</Text></View>) : null}
          <FlatList

            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.name}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}



const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator

      >
        <Tab.Screen name="О приложении" component={Home} options={{ unmountOnBlur: true }} unmountOnBlur={true} />
        <Tab.Screen name="Котировки" component={Quotes} options={{ unmountOnBlur: true }} unmountOnBlur={true} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}