import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store';
import { Domain } from '../../stores/DomainStore';
import { useNavigate } from 'react-router-dom';
import { ExplorationProgress } from './ExplorationProgress';
import { runInAction } from 'mobx';

const ChooseDomain: React.FC<any> = observer((props) => {
  let { domainStore } = useStore();
  let { exploreDataStore } = useStore();
  const navigate = useNavigate();
  const domains: Domain[] = domainStore.availableDomains;

  React.useEffect(() => {
    domainStore.fetchDomains();
  }, [domainStore]);

  const onChooseDomain = (domain: Domain) => {
    runInAction(() => {
      // Set the newly selected domain and start fetching the configuration
      exploreDataStore.userConfig.domain = domain;
      domainStore.fetchDomainConfig(domain.repo_url);
    });
    navigate('/explore/inputs-outputs');
  };

  return (<div>
    <ExplorationProgress index={0} />
    <div className="m-20">
      <div className="overflow-x-auto text-left space-y-6 m-8 flex justify-center">
        <table className="table w-4/5">
          <thead>
            <tr>
              <th>Name</th>
              <th>Executable</th>
              <th>Description</th>
              <th>Topics</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          { domains.map(domain => (
            <tr key={domain.id}>
              <td>{domain.unique_label}</td>
              <td>
                  <span
                    className={`inline-block w-6 h-6 text-center rounded-full ${
                      domain.executable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}
                  >
                    {domain.executable ? '✓' : '✗'}
                  </span>
                </td>
              <td>{ domain.description }</td>
              <td>{ domain.topic_of_research.map((topic, index) => 
                  (<span key={index} className="badge">{topic.unique_label}</span>)) }</td>
              <td><button className="btn btn-primary" onClick={() => onChooseDomain(domain)}>Choose</button></td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>);
});

export { ChooseDomain };
