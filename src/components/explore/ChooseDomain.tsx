import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Domain } from '../../stores/DomainStore';
import { Link } from 'react-router-dom';
import { ExplorationProgress } from './ExplorationProgress';

const ChooseDomain: React.FC<any> = observer(({ nextStep }) => {
  let { domainStore } = useStore();
  const domains: Domain[] = domainStore.availableDomains;

  React.useEffect(() => {
    domainStore.fetchData();
  }, [domainStore]);

  return (<div>
    <ExplorationProgress index={0} />
    <div className="m-8">
      <div className="flex">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Topics</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          { domains.map(domain => (
            <tr key={domain.id}>
              <td>{ domain.unique_label }</td>
              <td>{ domain.description }</td>
              <td>{ domain.topic_of_research.map((topic, index) => 
                  (<span key={index} className="badge">{topic.unique_label}</span>)) }</td>
              <td><Link to="/explore/inputs-outputs"><button className="btn btn-primary">Choose</button></Link></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>);
});

export { ChooseDomain };
