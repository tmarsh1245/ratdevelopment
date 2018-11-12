# ratdevelopment

For the CS 320 Class at UMass

# Quick Start

The first step is to get the Vagrant virtual machine running. This command will start the Vagrant machine which is configured to be a Cassandra node:
```
vagrant up
```

After the vagrant machine starts up to run all the tests for the repository, run:
```
go test ./...
```

Optionally add `-bench .` or `-bench=.` to run the benchmarking tests, or add `-v` for verbose output, such as:
```
go test ./... -v -bench .
```

## Vagrant Info
The `Vagrantfile` in the repo currently starts a Cassandra node on 10.10.10.31 by default.
If you wish to use `cqlsh` or other command line tools like `nodetool` to interact directly with the cassandra instance, use:
```
vagrant ssh
```

## Cassandra Basics

Cassandra should typically start when your machine starts
But if it isnt running, just use the following to start it
```
service cassandra start
```

Alternatively, to stop Cassandra use
```
service cassandra stop
```

When cassandra is running, use the following to get into the cluster to start messing around with things
Do note that you cant use GoCQL to mess with the schema at all, that has to be done through cqlsh
```
cqlsh 10.10.10.31
```

### Automatic schema setup
This script should be run by `vagrant up`, 
but if it isn't then be sure to `vagrant ssh` into the virtual machine and run
```
/vagrant/scripts/migrate.sh 10.10.10.31
```
which will run the cql in schema.cql on your local cassandra database.

### Manual schema setup
This section is left for posterity

First your going to have to create is a keyspace
I'm going to recommend the following:
```
CREATE KEYSPACE IF NOT EXISTS keyspace_name WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};
```
replication_factor refers to the number of replicas of data kept on multiple nodes. Make sure this never exceeds your node count, or all operations will fail. (required for SimpleStrategy)
Class refers to the replication strategy used, two main types:
SimpleStrategy - all node clusters will use the same replication factor
NetworkTopologyStrategy - allows you to set the replication factor on a per data center basis (also has some other quirks involving physical location of the nodes)

NetworkTopologyStrategy is typically recommended (easier when expanding in the future), but for the purposes of cassandra on our local machines it wont really matter so its easier to just use SimpleStrategy

Next, need to create a table. It uses the following format
```
CREATE TABLE IF NOT EXISTS keyspace_name.table_name (
    field_name_one datatype,
    field_name_two datatype,
    field_name_three datatype,
    ...,
    PRIMARY KEY ((field_name_one), field_name_three)
    ) WITH CLUSTERING ORDER BY (field_name_three DESC);
```

Now you should be ready to enter data (using GoCQL too)
Basic CQL Command formats:
```
INSERT INTO table_name (field_name_one, field_name_two) VALUES (data_one, data_two);
SELECT * FROM keyspace_name.table_name WHERE primary_key = 'some_value' AND (other key/value relations);
UPDATE table_name SET field_name_one = 'new_data' WHERE primary_key = 'some_value';
DELETE FROM table_name WHERE (some relations);
```
Refer to http://cassandra.apache.org/doc/latest/cql/dml.html to go more in depth into CQL

### Potentially useful tidbits

Use the following from within `cqlsh` to see all of your clusters...
```
SELECT cluster_name, listen_address FROM system.local;
```