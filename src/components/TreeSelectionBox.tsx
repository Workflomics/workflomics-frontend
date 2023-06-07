import * as React from 'react';

export interface TreeNode {
  id: string;
  label: string;
  subsets: Array<TreeNode> | undefined;
  filteredSubsets: Array<TreeNode> | undefined;
}

const TreeSelectionBox: React.FC<any> = ({nodes, value, onChange, placeholder}) => {
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [currentValue, setCurrentValue] = React.useState<TreeNode>(value);
  const [filter, setFilter] = React.useState<string>("");
  const [filteredNodes, setFilteredNodes] = React.useState<Array<TreeNode>>([]);
  const [isDropDownOpen, setIsDropDownOpen] = React.useState<boolean>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFilter(value);
    setFilteredNodes(filterNodes(nodes, value));
    setIsDropDownOpen(true);
  };

  const filterNodes = (nodes: Array<TreeNode>, filter: string): Array<TreeNode> => {
    const items: Array<TreeNode> = [];
    const lcFilter = filter.toLowerCase();
    nodes.forEach(node => {
      node.filteredSubsets = node.subsets ? filterNodes(node.subsets, filter) : [];
      if (node.label.toLowerCase().includes(lcFilter) || node.filteredSubsets.length > 0 || lcFilter === "") {
        items.push(node);
      }
    })
    return items;
  };

  const handleFocus = (): void => {
    setIsDropDownOpen(true);
    setFilteredNodes(filterNodes(nodes, filter)); // initialize filtered nodes
  };

  const handleBlur = (): void => {
    setTimeout(() => {
      if (dropdownRef.current && !dropdownRef.current.contains(document.activeElement)) {
        setIsDropDownOpen(false);
      }
    }, 0);
  };

  const onSelectNode = (node: TreeNode) => {
    setCurrentValue(node);
    onChange(node);
    setIsDropDownOpen(false);
  };

  const currentText = !isDropDownOpen && currentValue.id !== "" ? currentValue.label : filter;

  const renderSubNodes = (nodes:any) => {
    return (
      <ul className="dropdown-content p-1 w-80">
        {nodes.map((node: TreeNode) => (
            (<li className="pl-6" key={node.label}>
                { node.filteredSubsets && node.filteredSubsets.length > 0 ? 
                    // Node with children
                    (<details>
                      <summary><button className="hover:bg-sky-200 p-2 rounded" onClick={() => onSelectNode(node)}>{node.label}</button></summary>
                      { renderSubNodes(node.filteredSubsets) }
                    </details>) :
                    // Node without children
                    (<button className="hover:bg-sky-200 p-2 rounded" onClick={() => onSelectNode(node)}>{node.label}</button>)
                }
              </li>)
            ))
        }
      </ul>
    );
  }

  return (
    <div className="relative" onBlur={handleBlur}>
      {/* Textbox that displays value, allows filter */}
      <input type="text" value={currentText} onChange={handleSearch}
          onFocus={() => handleFocus()}
          placeholder={placeholder} className="input input-bordered w-80 m-1"></input>

      {/* Dropdown with tree */}
      { isDropDownOpen && <div className="absolute border bg-white shadow rounded w-80 m-1 z-10" ref={dropdownRef}>
          {renderSubNodes(filteredNodes)}
      </div> }
    </div>
  );
};

export { TreeSelectionBox };
