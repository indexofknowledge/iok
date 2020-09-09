// eslint-disable-line
/* eslint-disable no-console */
/* eslint-disable no-alert */
import React from 'react';
import { PropTypes } from 'prop-types';
// import Log from './log';
// import './styles/IokText.css';
import './IokText.css';

// import { GRAPH_FILENAME } from './constants';
import { NTYPE } from './types';

function IokText({ node }) {
  const data = node ? node.data : {
    name: 'Overview',
    data: { text: 'Index of Knowledge (IoK) is a curated collection of resources for blockchain, grouped by topic and topologically ordered by pedagogical dependency.' },
    resource_type: 1,
    node_type: 2,
  };

  const neighbors = node ? node.neighbors : [data];
  const depList = [];
  const descList = [];
  const linkList = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const neighbor of neighbors) {
    if (neighbor.node_type === NTYPE.TOPIC) { // topic is dep
      depList.push(<li key={neighbor.name}>{neighbor.name}</li>);
    } else if (neighbor.node_type === NTYPE.RESO) { // resource
      if (neighbor.resource_type === 1) { // desc
        descList.push(<li key={neighbor.data}>{neighbor.data.text}</li>);
      } else { // link type
        // eslint-disable-next-line max-len
        linkList.push(<li key={neighbor.data}><a href={neighbor.data.link}>{neighbor.data.text}</a></li>);
      }
    }
  }
  // XXX: HACK!! if no node is selected, we use a linkList alongside a descList
  if (!node) {
    linkList.push(<li key="dummy"><a href=".">Resource links appear here!</a></li>);
  }

  return (

    <div className="sidebar">
      <div>
        <h2 className="nodetitle">{data.name}</h2>
        <div><p></p></div>
        {/* <p className="byline">
          From
          {' '}
          <a href="http://localhost:3000/">Rustie&apos;s IoK</a>
          {' '}
          by Rustie
        </p> */}
        {/* <div className="circles">
          <div className="circle" style={{ backgroundColor: '#51B9C8' }}>#</div>
          <div className="circle" style={{ backgroundColor: '#CAB467' }}>@</div>
          <div className="circle" style={{ backgroundColor: '#CD6052' }}>!</div>
          <div className="circle">[?]</div>
        </div> */}
        {/* <p id="nodesubtitle">{subtitle}</p> */}
        {
          depList.length !== 0 && (
            <div className="section depsection">
              <h3 className="heading">
                You&apos;ll first need to understand
              </h3>
              <ul id="nodedeps">
                {depList}
              </ul>
            </div>
          )
        }

        {
          descList.length !== 0 && (
            <div className="section descriptionsection">
              <h3 className="heading">
                What is
                {' '}
                {data.name}
                ?
              </h3>
              <ul id="nodedescs">
                {descList}
              </ul>
            </div>
          )
        }

        {
          linkList.length !== 0 && (
            <div className="section linksection">
              <h3 className="heading">Learn more</h3>
              <ul id="nodelinks">
                {linkList}
              </ul>
            </div>
          )
        }
      </div>

      {
        data.id && (
          <div>
            {' '}
            <h3 className="heading">Debugging</h3>
            <p className="nodeid">{data.id}</p>
          </div>
        )
      }

    </div>
  );
}

IokText.defaultProps = {
  node: null,
};

IokText.propTypes = {
  node: PropTypes.object, // eslint-disable-line
};

export default IokText;
