import * as React from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useStore } from '../store';
import { Domain } from '../stores/DomainStore';

const ChooseDomain: React.FC<any> = observer(props => {
  let { domainStore } = useStore();
  domainStore = useLocalObservable(() => domainStore);
  const domains: Domain[] = domainStore.availableDomains;

  React.useEffect(() => {
    domainStore.loadData();
  }, [domainStore]);

  return (
    <div className="m-8">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Topics</th>
              <th>Verified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          { domains.map(domain => (
            <tr key={domain.id}>
              <td>{ domain.label }</td>
              <td>{ domain.topics.map(topic => (<span className="badge">{topic}</span>)) }</td>
              <td>{ domain.verified }</td>
              <td><button className="btn btn-primary">Explore</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

export { ChooseDomain };
