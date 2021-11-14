import React, { Component } from 'react'
import { View, Text, Button, TextInput, StyleSheet } from 'react-native'
import { ApolloClient, HttpLink, InMemoryCache  } from 'apollo-boost'
import { ApolloProvider, graphql, Mutation } from 'react-apollo';
import gql from 'graphql-tag'

const client = new ApolloClient({
    link: new HttpLink({
      uri:'http://10.20.7.119:5000/graphql'
    }),
    cache: new InMemoryCache(),
  })

const customeradd = gql`mutation issueAdd($issue: IssueInputs!) {
    issueAdd(issue: $issue) {
      id
    }
  }`;

const customerquery = gql`query {
    issueList {
      id name phone created
    }
  }`;

export class RNApp extends Component {
  constructor() {
    super()
    this.state = {
      name: '',
      phone:''
    }
    
  }
  
  render () {
    return (
    <ApolloProvider client={client}>
      <View style={styles.container}>
        <Mutation mutation={customeradd} refetchQueries={[{ query: customerquery }]}>
        {(addMutation, { data }) => (
              <View>
                <Text style={styles.welcome}>Add a new customer:</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({ name: text })}
                  value={this.state.name}
                  placeholder="Name"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => this.setState({ phone: text })}
                  value={this.state.phone}
                  placeholder="Phone number"
                />
                <Button
                  onPress={() => {
                    const issue={name:this.state.name, phone:this.state.phone}
                    addMutation({
                      variables: {
                        issue:issue
                      },
                    })
                      .then((res) => res)
                      .catch((err) => <Text>{err}</Text>)
                    this.setState({ phone: '', name: '' })
                  }}
                  title="Add a customer"
                />
              </View>
            )}
        </Mutation>
      </View>
    </ApolloProvider>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#555555',
    },
    welcome: {
      fontSize: 30,
      textAlign: 'center',
      margin: 20,
    },
    input: {
      height: 40,
      width: 120,
      borderColor: 'blue',
      borderWidth: 2,
      marginTop: 10,
      padding: 2,
    },
  })

  export default RNApp