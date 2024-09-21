import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

function TaskColumn({ tasks, status }) {
  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          className="task-column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h3>{status.toUpperCase()}</h3>
          {tasks
            .filter((task) => task.column === status)
            .map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <div
                    className="task-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <p>{task.title}</p>
                  </div>
                )}
              </Draggable>
            ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default TaskColumn;
